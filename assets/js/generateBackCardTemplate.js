const hostname = "http://127.0.0.1:3000";

const generateCardTemplateEn = function (
  namesurname,
  id,
  number,
  img,
  status,
  qr,
  bday,
  validate
) {
  return `<html><style>
  @import url("//cdn.web-fonts.ge/fonts/bpg-web-002/css/bpg-web-002.min.css");

@import url("https://cdn.web-fonts.ge/fonts/bpg-nino-mtavruli-bold/css/bpg-nino-mtavruli-bold.min.css");
@import url("https://cdn.web-fonts.ge/fonts/bpg-arial/css/bpg-arial.min.css");

//BPG WEB 002

@font-face {
  font-family: 'BPG Nino Mtavruli Bold';  
  src: url('https://cdn.web-fonts.ge/fonts/bpg-nino-mtavruli-bold/css/bpg-nino-mtavruli-bold.min.css') format('woff2'); // don't forget the format!
}

@font-face {
  font-family: 'BPG WEB 002';  
  src: url('https://cdn.web-fonts.ge/fonts/bpg-nino-mtavruli-bold/css/bpg-nino-mtavruli-bold.min.css') format('woff2'); // don't forget the format!
}


  /* Card Styles */
body{
    width: 166.6mm;
    height: 105mm;
}

.cards {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .card-side {
    font-family: "BPG Nino Mtavruli Bold", sans-serif;
    font-weight: 400;
    width: 166.6mm;
    height: 105mm;
    border: 0;
    letter-spacing: 0;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #ccc;
  }
  
  .card-side::before {
    content: "";
    width: 450px;
    height: 400px;
    background: url("../img/card/amnistia.png") no-repeat center/contain;
    position: absolute;
    left: 50px;
    top: 50px;
    opacity: 0.09;
    transform: rotate(49deg);
    z-index: -10;
  }
  
  .left-style {
      width: 38%;
      height: 100%;
      position: absolute;
      background-color: #FCDBDB;
      z-index: -5;
  }
  
  
  .card-header {
    background-color: transparent;
    padding: 40px 40px 0 40px;
    border: 0;
    font-size: 26px;
    color: #AC4343;
    margin-bottom: 24px;
  }
  
  .card-main {
    display: flex;
    justify-content: space-between;
    padding: 0 50px 0 40px;
    flex: 1;
    gap: 4px;
  }
  
  .card-info {
    margin-top: 20px;
  }
  
  .card-info span {
    font-family: "BPG WEB 002", sans-serif;
    display: block;
    font-size: 12px;
    color: #6a6a6a;
    margin: 0 0 4px 0;
    padding: 0;
  }
  
  .card-info h4 {
    font-family: inherit;
    font-size: 22px;
    color: #040505;
    margin: 0 0 18px 0;
    padding: 0;
  }
  
  .card-img {
    min-width: 130px;
    width: 130px;
    height: 160px;
    margin-left: 8px;
  }
  
  .card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .card-qrcode img {
    width:130px;
    height: 130px;
    object-fit:auto;
}

  .card-footer {
    background-color: transparent;
    padding: 24px 50px 24px 40px;
    border: 0;
    font-size: 18px;
    color: #040505;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;
  }
  
  .card-footer * {
    font-size: inherit;
  }
  
  .bedge {
    display: flex;
    align-items: center;
    text-transform: uppercase;
  }
  
  .bedge-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 12px;
    margin-bottom: 12px;
  }
  
  .bedge-icon .img-fluid {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  </style>
  <body><div id="cards" class="cards card-{{status}}">
  <div id="card-back" class="card-side">
  <div class="left-style"></div>
  <header class="card-header">AMNESTY SUPPORTERS SOCIETY</header>
    <main class="card-main">
    <div class="card-info">
    <span>name surname</span>
    <h4>{{namesurname}}</h4>
    <span>date of birth</span>
    <h4>{{bday}}</h4>
    </div>
    <div class="card-info">
    <span>personal number</span>
    <h4>{{idnum}}</h4>
    <span>number</span>
    <h4>{{n}}</h4>
    </div>
    <div id="card-img" class="card-img">
    <div class="card-qrcode">
    <img src="{{qr}}">
    </div>
    </div>
    </main>
    <footer class="card-footer">
    <div class="bedge">
        <div class="bedge-icon">
            <img class="img-fluid" src="{{badge}}">
        </div>
        {{status}}
    </div>
    <div>
        VALID: <span>{{validate}}</span>
    </div>
    </footer>
</div></div></body></html>`;
};
export default generateCardTemplateEn;
