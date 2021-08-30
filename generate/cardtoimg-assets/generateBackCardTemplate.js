const generateCardTemplateEn = function () {
  return `
  <html>
  <style>
  @import url("https://cdn.web-fonts.ge/fonts/bpg-nino-mtavruli-bold/css/bpg-nino-mtavruli-bold.min.css");
  @import url("https://cdn.web-fonts.ge/fonts/bpg-web-002/css/bpg-web-002.min.css");


    /* Card Styles */
    body{
        width: 166.6mm;
        height: 105mm;
    }
    .cards {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 1rem;
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
      
      .asset-img {
        width: 450px;
        height: 400px;
        position: absolute;
        left: 50px;
        top: 50px;
        opacity: 0.09;
        transform: rotate(49deg);
        z-index: -10;
      }
      
      
      .left-style {
        width: 46%;
        height: 100%;
        position: absolute;
        left: -1px;
        z-index: -5;
      }
      
      .left-style svg {
        width: 100%;
        height: 100%;
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
      }
      
      .card-info {
        margin-top: 20px;
        text-transform: capitalize;
      }
      
      .card-info span {
        font-family: "BPG WEB 002", sans-serif;
        display: block;
        font-size: 12px;
        color: #6A6A6A;
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
        width: 130px;
        height: 160px;
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
        padding: 24px 50px 18px 40px;
        border: 0;
        font-size: 18px;
        color: #040505;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        z-index: 10;
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

  <body>
  <div id="card-back" class="card-side">
    <div class="left-style">
        <svg xmlns="http://www.w3.org/2000/svg" width="145.519" height="200.274" viewBox="0 0 145.519 200.274">
            <path id="Path_2" data-name="Path 2" d="M476.99,0c-1.171,0-64.788,37.464-7.415,93.134s21.856,107.139,21.856,107.139H356.781V0Z" transform="translate(-356.781)" fill="#fcdbdb"/>
        </svg>
    </div>
    <img class="asset-img" src="{{assetImg}}" alt="hands">
    <header class="card-header">AMNESTY SUPPORTERS SOCIETY</header>
        <main class="card-main">
        <div class="card-info">
        <span>name surname</span>
        <h4>{{name}}</h4>
        <span>date of birth</span>
        <h4>{{birth_date}}</h4>
        </div>
        <div class="card-info">
        <span>personal number</span>
        <h4>{{id_number}}</h4>
        <span>number</span>
        <h4>{{card_number}}</h4>
        </div>
        <div id="card-img" class="card-img">
        <div class="card-qrcode">
        <img src="{{QRValue}}">
        </div>
        </div>
        </main>
        <footer class="card-footer">
        <div class="bedge">
            <div class="bedge-icon">
                <img class="img-fluid" src="{{badgeIcon}}" alt="bedge">
            </div>
            {{status}}
        </div>
        <div>
            Registered: <span>{{registration}}</span>
        </div>
      </footer>
    </div>
  </body>
</html>`;
};
export default generateCardTemplateEn;
