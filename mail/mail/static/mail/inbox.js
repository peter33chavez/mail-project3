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


  //add the timestamp
  const timestamp = document.createElement('div');
  timestamp.className = 'mail-time';
  timestamp.innerHTML = email.timestamp;

  //add the sender/recipients
  const recipient = document.createElement('div');
  recipient.className = 'mail-from';

  if(mailbox === 'inbox' || mailbox === 'archive'){
    recipient.innerHTML = email.sender;

    //archive btn
    const archive = document.createElement('button');
    archive.className = 'archive-btn btn btn-sm btn-outline-primary';
    archive.innerHTML = 'Archive';
    archive.value = email.archived;
    archive.addEventListener('click', function(){
      archived(email.id, archive);
    });

    timeContainer.append(timestamp, archive);
  }
  else{
    recipient.innerHTML = email.recipients[0];
    timeContainer.append(timestamp);
    }

  //add the subject
  const subject = document.createElement('div');
  subject.className = 'mail-subject';
  if(email.subject === ""){
    subject.innerHTML = '(No Subject)'
  }
  else{
    subject.innerHTML = email.subject;
  }
  //add the body 
  const body = document.createElement('div');
  body.className = 'mail-body';
  body.innerHTML = email.body;

  //add the all the details to a card
  detailContainer.append(recipient, subject, body);
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
    viewEmail(email.id, mailbox);
  });
  
};

function viewEmail(email_id, mailbox){
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
          read: true
        })
      })

      //create containers
      const headerContainer = document.createElement('header');
      headerContainer.className = 'email-header';

      const recipientsContainer = document.createElement('div');
      recipientsContainer.className = 'detail-container';

      const timeContainer = document.createElement('div');
      timeContainer.className = 'time-container';

      const bodyContainer = document.createElement('div');
      bodyContainer.className = 'body-container';

      const actionContainer = document.createElement('div');
      actionContainer.className = 'action-container';
     

      //recipientsContainer
      //sender
      const sender = document.createElement('div');
      sender.className = 'mail-from';
      sender.innerHTML = email.sender;
      //recipients
      const recipients = document.createElement('div');
      recipients.className = 'mail-to';
      recipients.innerHTML = `To: ${email.recipients}`;
      //add to container
      recipientsContainer.append(sender, recipients);
      
      //timeContainer
      //time
      const time = document.createElement('div');
      time.className = 'mail-time'
      time.innerHTML = email.timestamp;
      //add to container
      timeContainer.append(time);

      //add detail containers to header
      headerContainer.append(recipientsContainer, timeContainer);
      
      //bodyContainer
      //subject
      const subject = document.createElement('div');
      subject.className = 'view-subject';
      if(email.subject === ""){
        subject.innerHTML = '(No Subject)'
      }
      else{
        subject.innerHTML = email.subject;
      }
      //body
      const body = document.createElement('div');
      body.className = 'view-body';
      body.innerHTML = email.body;
      //add to container
      bodyContainer.append(subject, body);

      //add reply btn
      const replyBtn = document.createElement('button');
        replyBtn.className = 'actionBtn btn btn-sm btn-outline-primary';
        replyBtn.innerHTML = 'Reply';
        actionContainer.append(replyBtn);
        replyBtn.addEventListener('click', function(){
          reply(email);
        });
      
      //archive btn
      if(mailbox !== 'sent'){
        const archive = document.createElement('button');
        archive.className = 'actionBtn btn btn-sm btn-outline-primary';
        archive.innerHTML = 'Archive';
        archive.value = email.archived;
        actionContainer.append(archive);
        archive.addEventListener('click', function(){
          archived(email.id, archive);
        });
      }
      //add everything to the view page
      viewEmail.append(headerContainer, bodyContainer, actionContainer);
    });
}

function archived(email_id, archive){
  if(archive.value == 'false'){
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
  }
  else if(archive.value == 'true'){
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
  }
};

function reply(email){
  // Show compose view and hide other view
  document.querySelector('#view-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // pre-fill fields
  document.querySelector('#compose-recipients').value = email.recipients;
  if(email.subject === ""){
    document.querySelector('#compose-subject').value = '(No Subject)'
  }
  else{
    document.querySelector('#compose-subject').value = `Re:${email.subject}`;
  }
  document.querySelector('#compose-body').value = `
  On ${email.timestamp} ${email.sender} wrote: ${email.body}`;

  document.querySelector('#compose-form').onsubmit = sendEmail;
};

