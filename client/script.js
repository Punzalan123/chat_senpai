import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

const loader = (e) => {
  e.textContent = '';

  loadInterval = setInterval(() => {
    e.textContent += '.';

    if(e.textContent === '....'){
      e.textContent = '';
    }
  }, 300);

}

const typeText = (e, t) => {
  let index = 0;

  let interval = setInterval(() => {
    if(index < t.length){
      e.innerHTML += t.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  }, 25);
}

const generate = () => {
  const t = Date.now();
  const r = Math.random();
  const h = r.toString(16);
  return `id-${t}-${h}`;
}

const chatStrp = (isAi, val, uId) => {
  return(
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img  
          src="${isAi ? bot : user}"
          alt="${isAi ? 'bot' : 'user'}"
          />
        </div>
        <div class="message" id=${uId}>${val}</div>
      </div>
    </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  chatContainer.innerHTML += chatStrp(false, data.get('prompt'));

  form.reset();

  const u = generate();
  chatContainer.innerHTML += chatStrp(true, " ", u);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const msd = document.getElementById(u);

  loader(msd);

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  msd.innerHTML = '';

  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(msd, parsedData);
  }else{
    const err = await response.text();

    msd.innerHTML = "Something went wrong"
    alert(err) ;
  }

}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})



