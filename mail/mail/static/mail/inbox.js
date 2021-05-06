document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mail-container').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').onsubmit = sendEmail;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#mail-container').innerHTML = "";
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //query mail
  get_mail(mailbox);
  
}

function sendEmail() {
  //Send data to database
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(results => {

    //error handling for null recipients
    if(results.message){
      load_mailbox('sent');
      alert(results.message)
      
    }
    else{
      alert(results.error)
    }     
  });
  return false;
}

function get_mail(mailbox){

  // target container 
  const mailContainer = document.querySelector('#mail-container');

  //query api for mail
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    //error handling for mailbox
    if(emails.error){
      mailContainer.innerHTML = `<h5>${emails.error}</h5>`;
    }
    else{
      mailContainer.style.display = 'block';
      emails.forEach( email => mail_cards(email, mailbox));
    }
  });  
};

function mail_cards(email, mailbox){

  // grab/create all containers
  const mailContainer = document.querySelector('#mail-container');
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';
  const detailContainer = document.createElement('div');
  detailContainer.className = 'detail-container';
  const timeContainer = document.createElement('div');
  timeContainer.className = 'time-container';

  //add the sender/recipients
  const recipient = document.createElement('div');
  recipient.className = 'mail-from';

  if(mailbox === 'inbox'){
    recipient.innerHTML = email.sender;
  }
  else{
      recipient.innerHTML = email.recipients[0];
    }

  //add the subject
  const subject = document.createElement('div')
  subject.className = 'mail-subject';
  subject.innerHTML = email.subject;

  //add the body 
  const body = document.createElement('div')
  body.className = 'mail-body';
  body.innerHTML = email.body;

  //add the timestamp
  const timestamp = document.createElement('div')
  timestamp.className = 'mail-time';
  timestamp.innerHTML = email.timestamp;
    
  //add the all the details to a card
  detailContainer.append(recipient, subject, body);
  timeContainer.append(timestamp);
  cardContainer.append(detailContainer, timeContainer);
  mailContainer.append(cardContainer);

  //read option
  if(email.read === false){
    cardContainer.style.background = '#FFFFFF';
  }
  else{
    cardContainer.style.background = '#E4E4E4';
  }
};

