import { log } from "console";
import { createSlug, generateRandomId } from "../helpers/helpers.js";
import fs from "fs";
import nodemailer from "nodemailer";
// create student

export const createStudent = (req, res) => {
  const { name, roll, classs, section } = req.body;
  if (!name || !roll || !classs) {
    return res.status(400).json({ message: "Name and roll are required" });
  }
  const studentData = JSON.parse(fs.readFileSync("db/student.json").toString());
  if (studentData.some((data) => data.roll == roll)) {
    return res.status(400).json({ message: "This roll already exits." });
  }
  const student = {
    id: generateRandomId(),
    name,
    slug: createSlug(roll),
    roll,
    classs,
    section,
    photo: req.file.filename,
  };
  studentData.push(student);

  fs.writeFileSync("db/student.json", JSON.stringify(studentData));

  res.redirect("/home");
};

// get all student
export const getAllStudent = (req, res) => {
  const studentData = JSON.parse(fs.readFileSync("db/student.json").toString());

  res.status(200).json({ student: studentData });
};

// get single student
export const getSingleStudent = (req, res) => {
  const { slug } = req.params;
  const studentData = JSON.parse(fs.readFileSync("db/student.json").toString());

  const singleStudent = studentData.find((data) => data.slug === slug);

  if (!singleStudent) {
    return res.status(400).json({ message: "Single data not found" });
  }

  res.status(200).json({ student: singleStudent });
};

//delete student
export const deleteStudent = (req, res) => {
  const { id } = req.params;
  const studentData = JSON.parse(fs.readFileSync("db/student.json").toString());

  const updateStudent = studentData.filter((data) => data.id != id);
  fs.writeFileSync("db/student.json", JSON.stringify(updateStudent));
  res.redirect("/home");
};

// get all student page
export const getStudentPage = (req, res) => {
  const studentData = JSON.parse(fs.readFileSync("db/student.json").toString());
  res.render("student", { student: studentData });
};

// create student page
export const createStudentPage = (req, res) => {
  res.render("create");
};
// single student page
export const createSinglePage = (req, res) => {
  const { slug } = req.params;
  const studentData = JSON.parse(fs.readFileSync("db/student.json").toString());

  const singleStudent = studentData.find((data) => data.slug === slug);
  res.render("single", { student: singleStudent });
};
// edit Single Page
export const editSinglePage = (req, res) => {
  const { id } = req.params;
  const studentData = JSON.parse(fs.readFileSync("db/student.json").toString());
  const editSingleStudent = studentData.find((data) => data.id === id);
  res.render("edit", { student: editSingleStudent });
};

// update student

export const editStudent = (req, res) => {
  const { id } = req.params;
  const { name, roll, classs, section } = req.body;
  // get all student
  const studentData = JSON.parse(fs.readFileSync("db/student.json").toString());
  // photo manage
  let photoName =
    studentData[studentData.findIndex((data) => data.id === id)].photo;

  if (req?.file?.filename) {
    photoName = req.file.filename;
  }

  if (studentData.some((item) => item.roll === roll)) {
    return res.status(400).json({ message: "This roll already exits." });
  }

  studentData[studentData.findIndex((data) => data.id === id)] = {
    name,
    roll,
    classs,
    section,
    id: id,
    slug: createSlug(roll),
    photo: photoName,
  };
  fs.writeFileSync("db/student.json", JSON.stringify(studentData));
  res.redirect("/home");
};

// admin Login Page
export const adminLoginPage = (req, res) => {
  const userData = JSON.parse(fs.readFileSync("db/user.json").toString());
  res.render("admin", { user: userData });
};

// create user
export const createUser = async (req, res) => {
  const { email, password } = req.body;

  // email sent
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: `${process.env.MAIL_ADDRESS}`,
    subject: "Create account successful.",
    to: email,
    html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
   <head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title>Password Reset Email Template</title><!--[if (mso 16)]>
      <style type="text/css">
      a {text-decoration: none;}
      </style>
      <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
  <xml>
      <o:OfficeDocumentSettings>
      <o:AllowPNG></o:AllowPNG>
      <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
    <style type="text/css">
  .rollover:hover .rollover-first {
    max-height:0px!important;
    display:none!important;
    }
    .rollover:hover .rollover-second {
    max-height:none!important;
    display:inline-block!important;
    }
    .rollover div {
    font-size:0px;
    }
    u + .body img ~ div div {
    display:none;
    }
    #outlook a {
    padding:0;
    }
    span.MsoHyperlink,
  span.MsoHyperlinkFollowed {
    color:inherit;
    mso-style-priority:99;
    }
    a.es-button {
    mso-style-priority:100!important;
    text-decoration:none!important;
    }
    a[x-apple-data-detectors] {
    color:inherit!important;
    text-decoration:none!important;
    font-size:inherit!important;
    font-family:inherit!important;
    font-weight:inherit!important;
    line-height:inherit!important;
    }
    .es-desk-hidden {
    display:none;
    float:left;
    overflow:hidden;
    width:0;
    max-height:0;
    line-height:0;
    mso-hide:all;
    }
    .es-button-border:hover > a.es-button {
    color:#ffffff!important;
    }
    .box-shadow {
    box-shadow:0 0 7px 1px #5050501f;
    }
  @media only screen and (max-width:600px) {*[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } h1 { font-size:25px!important; text-align:center; line-height:120%!important } h2 { font-size:22px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:25px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:22px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body a { font-size:13px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:11px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover div, .es-m-txt-c .rollover div, .es-m-txt-l .rollover div { line-height:0!important; font-size:0!important } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:14px!important } a.es-button, button.es-button { display:inline-block!important } .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .es-social td { padding-bottom:10px } .h-auto { height:auto!important } p, ul li, ol li, a { font-size:16px!important } a.es-button { border-left-width:0px!important; border-right-width:0px!important } }
  </style>
   </head>
   <body class="body" style="width:100%;height:100%;padding:0;Margin:0">
    <div class="es-wrapper-color" style="background-color:#F6F6F6"><!--[if gte mso 9]>
  			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
  				<v:fill type="tile" color="#f6f6f6"></v:fill>
  			</v:background>
  		<![endif]-->
     <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6">
       <tr>
        <td valign="top" style="padding:0;Margin:0">
         <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
           <tr>
            <td class="es-info-area" align="center" style="padding:0;Margin:0">
             <table bgcolor="transparent" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
               <tr>
                <td align="left" style="Margin:0;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px">
                 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                   <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                     <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td class="es-infoblock" align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#CCCCCC;font-size:14px">Put your preheader text here</p></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table></td>
           </tr>
         </table>
         <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
           <tr>
            <td align="center" style="padding:0;Margin:0">
             <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
               <tr>
                <td align="left" style="Margin:0;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px"><!--[if mso]><table style="width:560px" cellpadding="0"
                          cellspacing="0"><tr><td style="width:268px" valign="top"><![endif]-->
                 <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                   <tr>
                    <td align="left" style="padding:0;Margin:0;width:268px">
                     <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td class="es-m-p0l es-m-txt-c" align="left" style="padding:0;Margin:0;padding-top:15px;font-size:0"><img src="https://smjsrn.stripocdn.email/content/guids/CABINET_b1714667bb3b929b70b91e07b94c2da72768b30107c85915098ab246651d68e2/images/untitled_design_2.png" alt="" width="138" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" height="46"></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table><!--[if mso]></td><td style="width:20px"></td><td style="width:272px" valign="top"><![endif]-->
                 <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                   <tr>
                    <td align="left" style="padding:0;Margin:0;width:272px">
                     <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td class="es-m-txt-c" align="right" style="padding:0;Margin:0;padding-top:10px"><span class="es-button-border" style="border-style:solid;border-color:#0000FF;background:#0000FF;border-width:0px;display:inline-block;border-radius:0px;width:auto"><a href="https://viewstripo.email/" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:18px;color:#FFFFFF;padding:10px 20px 10px 20px;display:inline-block;background:#0000FF;border-radius:0px;font-weight:bold;font-style:normal;line-height:22px !important;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #0000FF;border-color:#0000FF">Contact us</a></span></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table><!--[if mso]></td></tr></table><![endif]--></td>
               </tr>
             </table></td>
           </tr>
         </table>
         <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
           <tr>
            <td align="center" style="padding:0;Margin:0;background-color:transparent" bgcolor="transparent">
             <table bgcolor="#090101" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#090101;background-repeat:no-repeat;width:600px;background-image:url(https://smjsrn.stripocdn.email/content/guids/CABINET_d6b02eef486e424923e42d33952bbae0/images/79241561453270953.jpg);background-position:center top" background="https://smjsrn.stripocdn.email/content/guids/CABINET_d6b02eef486e424923e42d33952bbae0/images/79241561453270953.jpg">
               <tr>
                <td align="left" style="padding:0;Margin:0;padding-top:20px">
                 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                   <tr>
                    <td align="left" style="padding:0;Margin:0;width:600px">
                     <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr class="es-mobile-hidden">
                        <td align="center" height="47" style="padding:0;Margin:0"></td>
                       </tr>
                       <tr>
                        <td align="left" class="es-m-txt-l" style="padding:0;Margin:0;padding-right:25px;padding-left:25px"><h2 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:bold;line-height:29px;color:#FFFFFF"><b>Your account has been created</b>&nbsp;and verified.</h2></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
               <tr>
                <td align="left" style="padding:0;Margin:0;padding-top:10px;background-position:center top">
                 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                   <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;width:600px">
                     <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td align="left" style="Margin:0;padding-right:20px;padding-bottom:10px;padding-left:20px;padding-top:15px"><span class="es-button-border" style="border-style:solid;border-color:#0000FF;background:#0000FF;border-width:0px;display:inline-block;border-radius:0px;width:auto"><a class="es-button" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:18px;color:#FFFFFF;padding:10px 25px;display:inline-block;background:#0000FF;border-radius:0px;font-weight:bold;font-style:normal;line-height:22px !important;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #0000FF" href="#">Login</a></span></td>
                       </tr>
                       <tr>
                        <td align="left" class="es-m-txt-l" style="padding:0;Margin:0;padding-right:25px;padding-left:25px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">​</p></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table></td>
           </tr>
         </table>
         <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
           <tr>
            <td align="center" style="padding:0;Margin:0">
             <table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
               <tr>
                <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px;background-position:center center"><!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                 <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                   <tr>
                    <td class="es-m-p20b" align="center" valign="top" style="padding:0;Margin:0;width:270px">
                     <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:center top" role="presentation">
                       <tr>
                        <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:21px;font-style:normal;font-weight:normal;line-height:25px;color:#0000ff">Follow Us.</h4></td>
                       </tr>
                       <tr>
                        <td align="left" style="padding:0;Margin:0;padding-top:5px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#090101;font-size:14px">It is a long established fact that a reader will be distracted by the readable&nbsp;</p></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table><!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                 <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                   <tr>
                    <td align="left" style="padding:0;Margin:0;width:270px">
                     <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:center top" role="presentation">
                       <tr>
                        <td align="left" style="padding:0;Margin:0"><h4 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:21px;font-style:normal;font-weight:normal;line-height:25px;color:#0000ff">Contact Us.</h4></td>
                       </tr>
                       <tr>
                        <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#090101;font-size:14px">It is a long established fact that a reader will be distracted by the readable&nbsp;</p></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table><!--[if mso]></td></tr></table><![endif]--></td>
               </tr>
               <tr>
                <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-bottom:10px;padding-left:20px;background-position:center top"><!--[if mso]><table  style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                 <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                   <tr>
                    <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:270px">
                     <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:center center" role="presentation">
                       <tr>
                        <td align="left" bgcolor="transparent" style="padding:0;Margin:0;padding-top:10px;font-size:0;background-color:transparent">
                         <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><img title="Facebook" src="https://smjsrn.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" width="32" height="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                            <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><img title="X.com" src="https://smjsrn.stripocdn.email/content/assets/img/social-icons/logo-black/x-logo-black.png" alt="X" width="32" height="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                            <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><img title="Instagram" src="https://smjsrn.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Inst" width="32" height="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                            <td align="center" valign="top" style="padding:0;Margin:0"><img title="Youtube" src="https://smjsrn.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png" alt="Yt" width="32" height="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table><!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                 <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                   <tr>
                    <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:270px">
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:center top" role="presentation">
                       <tr>
                        <td style="padding:0;Margin:0">
                         <table class="es-table-not-adapt" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td valign="top" align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;padding-right:5px;font-size:0"><img src="https://smjsrn.stripocdn.email/content/guids/CABINET_d6b02eef486e424923e42d33952bbae0/images/48411561457221481.png" alt="" width="21" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" height="21"></td>
                            <td align="left" style="padding:0;Margin:0">
                             <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr>
                                <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#090101;font-size:14px"><b><a target="_blank" style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;color:#0000FF" href="tel:123456789">123456789</a></b></p></td>
                               </tr>
                             </table></td>
                           </tr>
                           <tr>
                            <td valign="top" align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;padding-right:5px;font-size:0"><img src="https://smjsrn.stripocdn.email/content/guids/CABINET_d6b02eef486e424923e42d33952bbae0/images/34561561457385078.png" alt="" width="21" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" height="21"></td>
                            <td align="left" style="padding:0;Margin:0">
                             <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr>
                                <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#090101;font-size:14px"><strong><a target="_blank" href="mailto:your@mail.com" style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;color:#0000FF">your@mail.com</a></strong></p></td>
                               </tr>
                             </table></td>
                           </tr>
                           <tr>
                            <td valign="top" align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;padding-right:5px;font-size:0"><img src="https://smjsrn.stripocdn.email/content/guids/CABINET_d6b02eef486e424923e42d33952bbae0/images/9911561457458673.png" alt="" width="21" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" height="21"></td>
                            <td align="left" style="padding:0;Margin:0">
                             <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr>
                                <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#0000FF;font-size:14px"><strong>San Francisco</strong></p></td>
                               </tr>
                             </table></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table><!--[if mso]></td></tr></table><![endif]--></td>
               </tr>
             </table></td>
           </tr>
         </table>
         <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
           <tr>
            <td align="center" style="padding:0;Margin:0">
             <table bgcolor="#FFFFFF" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
               <tr>
                <td align="left" style="Margin:0;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;background-position:center top">
                 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                   <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                     <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:center top" role="presentation">
                       <tr>
                        <td align="center" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#999999;font-size:12px">Lorem ipgsum dolor sit amet, consectetur adipiscing <br></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#999999;font-size:12px">elit. Pellentesque vitae interdum ligula.</p></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table></td>
           </tr>
         </table>
         <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
           <tr>
            <td align="center" style="padding:0;Margin:0">
             <table bgcolor="transparent" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
               <tr>
                <td align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-top:30px;padding-bottom:30px;background-position:left top">
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                   <tr>
                    <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td align="center" style="padding:0;Margin:0;display:none"></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table></td>
           </tr>
         </table></td>
       </tr>
     </table>
    </div>
   </body>
  </html>
      `,
  });

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }
  const userData = JSON.parse(fs.readFileSync("db/user.json").toString());

  const user = {
    id: generateRandomId(),
    email,
    password,
  };
  userData.push(user);

  fs.writeFileSync("db/user.json", JSON.stringify(userData));

  res.redirect("/");
};
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  const userData = JSON.parse(fs.readFileSync("db/user.json").toString());
  const user = userData[userData.findIndex((data) => data.email === email)];
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  } else {
    if (user.email === email && user.password === password) {
      res.redirect("/home");
    } else {
      res.status(400).json({ message: "Email and Password are invalid" });
    }
  }
};
