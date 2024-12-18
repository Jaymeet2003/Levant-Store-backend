const inquiryEmailTemplate = (
  name,
  email,
  number,
  howDidYouFindUs,
  numberOfGuest,
  Occasion,
  date,
  venue,
  message
) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Catering Inquiry</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f8f8f8;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        text-align: center;
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 5px;
        overflow: hidden;
      }
      th,
      td {
        padding: 15px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      th {
        background-color: #f0f0f0;
      }
      tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      .cta-btn {
        display: block;
        width: 100%;
        background-color: #333;
        color: #fff;
        text-align: center;
        text-decoration: none;
        padding: 10px 0;
        border-radius: 5px;
        transition: background-color 0.3s ease;
      }
      .cta-btn:hover {
        background-color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Catering Inquiry</h1>
      <table>
        <tr>
          <th>Category</th>
          <th>Details</th>
        </tr>
        <tr>
          <td>Name</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>${email}</td>
        </tr>
        <tr>
          <td>Phone Number</td>
          <td>${number}</td>
        </tr>
        <tr>
          <td>How did you find out about us</td>
          <td>${howDidYouFindUs}</td>
        </tr>
        <tr>
          <td>Number of Guest</td>
          <td>${numberOfGuest}</td>
        </tr>
        <tr>
          <td>Occasion</td>
          <td>${Occasion}</td>
        </tr>
        <tr>
          <td>Date for the occasion</td>
          <td>${date}</td>
        </tr>
        <tr>
          <td>Location/Venue</td>
          <td>${venue}</td>
        </tr>
        <tr>
          <td>Message</td>
          <td>${message}</td>
        </tr>
      </table>
      <a href="tel:${number}" class="cta-btn" style="color: #fff">Call Customer</a>
    </div>
  </body>
</html>`;
};

module.exports = { inquiryEmailTemplate };
