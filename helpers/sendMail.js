const nodemailer = require('nodemailer');
const { SMTP_MAIL, SMTP_PASSWORD } = process.env;

const sendMail = async(email, mailSubject, content)=>{

    try{
        // console.log('Initializing transporter...');
       const transport =  nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:SMTP_MAIL,
                pass:SMTP_PASSWORD
            },
            // debug: true,
            // logger: true,
        });
        // console.log('Transporter initialized.');
        const mailOptions = {
            from:SMTP_MAIL,
            to:email,
            subject: mailSubject,
            html: content 
        }
        // console.log('Sending email to:', email);
         transport.sendMail(mailOptions, function(error, info){
              if(error)
              {
                console.log(error);
              }
              else{
                console.log("Email sent successfully : -", info.response);
              }
                
         });
    }
    catch(error){
          console.log(error.message);
    }

}
module.exports = sendMail;