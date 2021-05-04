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

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').onsubmit = sendEmail;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#mail-container').style.display = 'none';
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

  const mailContainer = document.querySelector('#mail-container');
  //query api for mail
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(data => {
    //error handling for mailbox
    if(data.error){
      mailContainer.innerHTML = `<h5>${data.error}</h5>`;
    }
    else{
      data.forEach( allMail => {
        //for (const mail of Object.keys(allMail)){
          console.log(allMail.subject)
          mailContainer.style.display = 'flex';
          mailContainer.innerHTML = 
          `<ul class='detail-container'>
            <li class="mail-from">
              <strong>${allMail.sender}</strong>
            </li>
            <li class="mail-subject">${allMail.subject}</li>
            <li class="mail-body">
            <p>${allMail.body}</p>
            </li>  
          </ul>
          <div class="time-container">
            <p class="mail-time">${allMail.timestamp}</p>
          </div>`;
          if(allMail.read === false){
            mailContainer.style.background = '#E4E4E4'
          }
          else{
            mailContainer.style.background = '#FFFFFF'
          }
        //};
      });
    };
  });
};
