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
  document.querySelector('#view-email').style.display = 'none';
  document.querySelector('#view-title').style.display = 'none';
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
  document.querySelector('#view-email').style.display = 'none';
  document.querySelector('#mail-container').innerHTML = "";
  document.querySelector('#view-title').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#view-title').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

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

  // add handler to view the selected email.
  cardContainer.addEventListener('click', function(){
    viewEmail(email.id);
  });
  
};

function viewEmail(email_id){
  const viewEmail = document.querySelector('#view-email');
  document.querySelector('#view-title').style.display = 'none';
  document.querySelector('#mail-container').style.display = 'none';
  document.querySelector('#view-email').innerHTML = "";
  viewEmail.style.display = 'block';

    fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {

      //mark the email as read
      fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: true
        })
      })

      //create containers
      var createDiv = document.createElement('div');
      var createFrag = document.createDocumentFragment('div');
      var headerContainer = document.createDocumentFragment('header');
      var recipientsContainer = createFrag;
      var timeContainer = createFrag;
      var bodyContainer = createFrag;
      const sender = createDiv;
      const recipients = createDiv;
      const time = createDiv; 
      const subject = createDiv;
      const body = createDiv;
      
      //give styling to all created containers
      headerContainer.className = 'card-container';
      recipientsContainer.className = 'detail-container';
      timeContainer.className = 'time-container';
      bodyContainer.className = 'body-container';
      sender.className = 'mail-from';
      recipients.className = 'mail-to';
      time.className = 'mail-time';
      subject.className = 'view-subject';
      body.className = 'view-body';

      //fill containers with data
      sender.innerHTML = email.sender;
      recipients.innerHTML = email.recipients;
      time.innerHTML = email.timestamp;
      subject.innerHTML = email.subject;
      body.innerHTML = email.body;

      //add div to the styled container
      recipientsContainer.append(sender, recipients);
      timeContainer.append(time);

      bodyContainer.append(subject, body);
      headerContainer.append(recipientsContainer, timeContainer);

      //add everything to the view page
      viewEmail.append(headerContainer, bodyContainer);
    });
}

