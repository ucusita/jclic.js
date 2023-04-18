let counter_particulas_id = 0;
let efectos_Particula = [
    'square',
    'emoji',
    'mario',
    'shadow',
    'line',
    'square'
];

export function popParticula(x_particula, y_particula) {
    let randomNumber = Math.floor(Math.random() * efectos_Particula.length);
    let tipo_animacion = efectos_Particula[randomNumber];
    //tipo_animacion = 'emoji';
    let amount = 10;
    switch (tipo_animacion) {
        case 'shadow':
        case 'line':
            amount = 60;
            break;
    }
    // Quick check if user clicked the button using a keyboard
    if (x_particula === 0 && y_particula === 0) {
        const bbox = 300;
        //console.log(bbox);
        const x_p = bbox;
        const y_p = bbox;
        for (let i = 0; i < 30; i++) {
            // We call the function createParticle 30 times
            // We pass the coordinates of the button for x & y values
            createParticle(x_p, y_p, tipo_animacion);
        }
    } else {
        for (let i = 0; i < amount; i++) {
            //console.log(x_particula, y_particula);
            //createParticle(e.clientX, e.clientY + window.scrollY, e.target.dataset.type);
            createParticle(x_particula, y_particula, tipo_animacion);
        }
    }
}

function createParticle(x_part, y_part, type) {
    console.log(x_part, y_part);
    const particle = document.createElement('particle');
    const jcplayer = document.getElementsByClassName("JClicPlayer")[0];
    jcplayer.appendChild(particle);
    counter_particulas_id++;
    particle.setAttribute("id", 'particle_' + counter_particulas_id);
    particle.style.position = 'fixed';

    let width = Math.floor(Math.random() * 30 + 8);
    let height = width;
    let destinationX = (Math.random() - 0.5) * 300;
    let destinationY = (Math.random() - 0.5) * 300;
    let rotation = Math.random() * 520;
    let delay = Math.random() * 200;

    switch (type) {
        case 'square':
            particle.style.background = `hsl(${Math.random() * 90 + 270}, 70%, 60%)`;
            particle.style.border = '1px solid white';
            break;
        case 'emoji':
            particle.innerHTML = ['❤', '🧡', '💛', '💚', '💙', '💜', '🤎'][Math.floor(Math.random() * 7)];
            particle.style.fontSize = `${Math.random() * 24 + 10}px`;
            width = height = 'auto';
            break;
        case 'mario':
            particle.style.backgroundImage = 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/mario-face.png)';
            break;
        case 'shadow':
            var color = `hsl(${Math.random() * 90 + 90}, 70%, 50%)`;
            particle.style.boxShadow = `0 0 ${Math.floor(Math.random() * 10 + 10)}px ${color}`;
            particle.style.background = color;
            particle.style.borderRadius = '50%';
            width = height = Math.random() * 5 + 4;
            break;
        case 'line':
            var color = `hsl(${Math.random() * 90 + 90}, 70%, 50%)`;
            particle.style.background = 'black';
            height = 1;
            rotation += 1000;
            delay = Math.random() * 1000;
            break;
    }

    particle.style.width = `${width}px`;
    particle.style.height = `${height}px`;

    const animation = particle.animate([{
            transform: `translate(-50%, -50%) translate(${x_part}px, ${y_part}px) rotate(0deg)`,
            opacity: 1
        },
        {
            transform: `translate(-50%, -50%) translate(${x_part + destinationX}px, ${y_part + destinationY}px) rotate(${rotation}deg)`,
            opacity: 0
        }
    ], {
        duration: Math.random() * 1000 + 5000,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        delay: delay
    });
    //console.log(particle);
    animation.finished.then(() => particle.remove());
}