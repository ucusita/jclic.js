import mario from './icons/mario-face.png';
import star from './icons/starg.png';
import moneda from './icons/monedag.png';
import pacman from './icons/pacmang.png';
import burbuja from './icons/bubble.png';
import flor from './icons/flor.png';
import caramelo from './icons/caramelo.png';

let efectos_Particula = [
    'square',
    'emoji',
    'emoji2',
    'mario',
    'star',
    'moneda',
    'pacman',
    'burbuja',
    'caramelo',
    'shadow',
    'flor',
    'line',
    'square'
];

export function popParticula(e, p = null) {
    //return;
    //console.log(e);
    let randomNumber = Math.floor(Math.random() * efectos_Particula.length);
    let tipo_animacion = efectos_Particula[randomNumber];
    //tipo_animacion = 'emoji';
    let amount = 30;
    switch (tipo_animacion) {
        case 'shadow':
            amount=10;
        case 'line':
            amount = 60;
            break;
        case 'emoji':
        case 'emoji2':
            amount = 50;
            break;
        case 'mario':
        case 'pacman':
        case 'burbuja':
            amount = 30;
            break;
        case 'star':
        case 'moneda':
            amount = 25;
            break;
    }
    // Quick check if user clicked the button using a keyboard
    console.log('Particulas', e, p);
    /* if (typeof e !== "undefined") {
        if (e.clientX === 0 && e.clientY === 0) {
            alert('0');
            const bbox = e.target.getBoundingClientRect();
            const x_p = bbox.left + bbox.width / 2;
            const y_p = bbox.top + bbox.height / 2;
            for (let i = 0; i < 30; i++) {
                // We call the function createParticle 30 times
                // We pass the coordinates of the button for x & y values
                createParticle(x_p, y_p, tipo_animacion);
            }
        } else { */
            for (let i = 0; i < amount; i++) {
                let datosXYok=true;
                let x;
                let y;
                x=e.pageX;
                y=e.pageY - e.currentTarget.offsetHeight - 40;
                if (isNaN(x)) {
                    let touch = e.targetTouches[0];
                    try {
                        x = touch.pageX;
                        y = touch.pageY - e.currentTarget.offsetHeight - 40;    
                    } catch (error) {
                        //console.log('No ha podido leer datos del touch');
                        x=p.x;
                        y=p.y - e.currentTarget.offsetHeight;
                        //console.log("Recalculo de x,y luego de error: ",x, y);                        
                    }
                    
                    if (isNaN(x)) datosXYok=false;
                }
                if (datosXYok)
                    //createParticle(e.clientX, e.clientY - e.currentTarget.offsetHeight, tipo_animacion);
                    createParticle(x, y, tipo_animacion);
          }
     /*     }
     } else {
        console.log('typeof e.clientX !== "undefined"');
        for (let i = 0; i < amount; i++) {
            createParticle(p.x, p.y, tipo_animacion);
        }
    } */

}

function createParticle(x_part, y_part, type) {
    //console.log(x_part, y_part, type);
    const particle = document.createElement('particle');
    particle.style.backgroundSize = 'cover';
    const jcplayer = document.getElementsByClassName("JClicPlayer")[0];
    particle.style.position = 'fixed';
    let rotarImageY=false;
    let tamanoAleatorio=false;

    let width = Math.floor(Math.random() * 40 + 8);
    let height = width;
    let destinationX = (Math.random() - 0.5) * 400;
    let destinationY = (Math.random() - 0.5) * 400;
    let rotation = Math.random() * 760;
    let delay = Math.random() * 200 + 30;
    //console.log(destinationX, destinationY, rotation, delay);

    switch (type) {
        case 'square':
            particle.style.background = `hsl(${Math.random() * 90 + 270}, 70%, 60%)`;
            particle.style.border = '1px solid white';
            break;
        case 'emoji':
            particle.innerHTML = ['❤', '🧡', '💛', '💚', '💙', '💜', '🤎'][Math.floor(Math.random() * 7)];
            particle.style.fontSize = `${Math.random() * 54 + 10}px`;
            width = height = 'auto';
            rotarImageY=true;
            break;
        case 'emoji2':
            const characters = ['♠', '♣', '♥', '♦', '★', '✨', '☀', '☁', '☔', '☂', '☃', '☽', '☾', '♛', '♝', '♞', '♟', '♖', '♜', '♔', '♚'];
            const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
            particle.innerHTML = randomCharacter;
            particle.style.fontSize = `${Math.random() * 54 + 10}px`;
            particle.style.color = getRandomColor();
            width = height = 'auto';
            break;
            
        case 'mario':
            //particle.style.backgroundImage = 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/mario-face.png)';
            particle.style.backgroundImage = `url(${mario})`;
            tamanoAleatorio=true;
            break;
        case 'star':
                particle.style.backgroundImage = `url(${star})`;
                rotarImageY=true;
                tamanoAleatorio=true;
                break;
        case 'moneda':
            particle.style.backgroundImage = `url(${moneda})`;
            rotarImageY=true;
            tamanoAleatorio=true;
            break;
        case 'pacman':
            particle.style.backgroundImage = `url(${pacman})`;
            tamanoAleatorio=true;
            break;
        case 'burbuja':
            particle.style.backgroundImage = `url(${burbuja})`;
            tamanoAleatorio=true;
            break;  
        case 'flor':
            particle.style.backgroundImage = `url(${flor})`;
            tamanoAleatorio=true;
            break;       
        case 'caramelo':
            particle.style.backgroundImage = `url(${caramelo})`;
            tamanoAleatorio=true;
            break;            
        case 'shadow':
            var color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
            particle.style.boxShadow = `0 0 ${Math.floor(Math.random() * 10 + 10)}px ${color}`;
            particle.style.background = color;
            particle.style.borderRadius = '50%';
            width = height = Math.random() * 50 + 4;
            break;
        case 'line':
            var color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
            particle.style.boxShadow = `0 0 ${Math.floor(Math.random() * 10 + 10)}px ${color}`;
            particle.style.background = color;
            height = 3;
            rotation += 1000;
            //delay = Math.random() * 1000;
            break;
    }

    if(tamanoAleatorio){
        width = Math.floor(Math.random() * 100 + 8);
        height = width;
    }
    particle.style.width = `${width}px`;
    particle.style.height = `${height}px`;
    let animation = '';

    if (rotarImageY==false){
        animation = particle.animate([{
                transform: `translate(-50%, -50%) translate(${x_part}px, ${y_part}px) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(-50%, -50%) translate(${x_part + destinationX}px, ${y_part + destinationY}px) rotate(${rotation}deg)`,
                opacity: 0.5
            }
        ], {
            duration: Math.random() * 1000 + 300,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            delay: delay
        });
    } else {
        animation = particle.animate([
            {
                transform: `translate(-50%, -50%) translate(${x_part}px, ${y_part}px) rotateY(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(-50%, -50%) translate(${x_part + destinationX}px, ${y_part + destinationY}px) rotateY(${rotation}deg)`,
                opacity: 0.5
            }
        ], {
            duration: Math.random() * 1000 + 300,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            delay: delay
        });
    }

    animation.onfinish = () => {
        particle.remove();
    };

    setTimeout(() => {
    jcplayer.appendChild(particle);
    }, 250);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
