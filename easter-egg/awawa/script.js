// 创建粒子效果
function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.background = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`;
        document.body.appendChild(particle);
    }
}

// 激活彩蛋
function activateEasterEgg() {
    const egg = document.getElementById('easterEgg');
    const text = document.getElementById('quantumText');
    egg.style.display = 'flex';
    
    // 解码摩斯密码
    const messages = [
        "awa你通关了？",
        "这里隐藏着开发者的小秘密",
        "倒数10个数",
        "10",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2",
        "1",
        "0",
        "awa你被骗了awa"
    ];
    
    let index = 0;
    const interval = setInterval(() => {
        text.textContent = messages[index];
        index++;
        if (index >= messages.length) {
            clearInterval(interval);
            setTimeout(() => {
                egg.style.display = 'none';
            }, 3000);
        }
    }, 2000);
}

// 键盘快捷键
let keySequence = [];
const secretCode = 'unicorn';

document.addEventListener('keydown', (e) => {
    keySequence.push(e.key);
    keySequence = keySequence.slice(-secretCode.length);
    
    if (keySequence.join('') === secretCode) {
        activateEasterEgg();
    }
});

// 点击裂缝也可触发
document.querySelector('.crack').addEventListener('click', activateEasterEgg);

// 初始化粒子
createParticles();