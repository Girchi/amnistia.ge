  // Testimonials API
  async function fetchUsers() {
    const response = await fetch('./assets/js/users.json');
    const users = await response.json()
    return users.data
  }

  async function setLatestUsers() {
    const latestUsers = document.getElementById('latestUsers')
    const userArray = await fetchUsers();
    
    for(let i = 0; i < 6; i++){
      console.log(userArray[i].ge);
      const currUser = `
        <div class="swiper-slide">
          <div class="testimonial-item">
            <img
              src="${userArray[i].ge.img}"
              class="testimonial-img"
              alt=""
            />
            <h3>${userArray[i].ge.name} ${userArray[i].ge.surname}</h3>
            <h4>მწეველი</h4>
          </div>
        </div>
      `;
      latestUsers.innerHTML += currUser;
    }
    didUsersSet = true;

  }

  document.addEventListener("DOMContentLoaded", setLatestUsers)

  /**
   * Testimonials slider
   */

  setTimeout(()=>{
    
    new Swiper('.testimonials-slider', {
      speed: 1000,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },

        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });

  }, 100)
