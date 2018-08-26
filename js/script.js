window.addEventListener('DOMContentLoaded', function() {

/* ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ТАБАМИ */	

	let tab = document.getElementsByClassName('info-header-tab'),
		tabContent = document.getElementsByClassName('info-tabcontent'),
		info = document.getElementsByClassName('info-header')[0];


		function hideTabContent(a) {
			for (i = a; i < tabContent.length; i++) {
				tabContent[i].classList.remove('show');
				tabContent[i].classList.add('hide');
			}
		};

		hideTabContent(1);

		function showTabcontent(b) {
			if (tabContent[b].classList.contains('hide')) {
				hideTabContent(0);
				tabContent[b].classList.remove('hide');
				tabContent[b].classList.add('show');
			}
		};

		info.addEventListener('click',function(e) {
			let target = e.target;
			if (target.className === 'info-header-tab') {
				for (let i = 0; i < tab.length; i++) {
					if (target === tab[i]) {
						showTabcontent(i);
						break;
					}
				}
			}
		});

/* ТАЙМЕР ОБРАТНОГО ОТСЧЕТА */

let deadline = '2018-08-27 23:59:59';//Задаем конечную дату

//Функция расчета оставшегося времени
function getTimeRemaining(endtime) {
//Установка текущей даты и даты окончания акции	
  let 	t = Date.parse(endtime) - Date.parse(new Date()),
		seconds = Math.floor( (t / 1000) % 60),
		minutes = Math.floor( (t / 1000 / 60) % 60),
		hours = Math.floor( t / (1000 * 60 * 60) );

  	//Возврат объекта данных времени
  	return {
	    'total': t,
	    'hours': hours,
	    'minutes': minutes,
	    'seconds': seconds
  	};
};

//Функция запуска таймера 
function initializeClock(id, endtime) {
//Задание элементов для вывода данных
  let clock = document.getElementById(id),
		hours = clock.querySelector('.hours'),
		minutes = clock.querySelector('.minutes'),
		seconds = clock.querySelector('.seconds'),
		//Установка интервала работы таймера в 1 секунду
		timeInterval = setInterval(updateClock, 1000);

//Функция таймера обратного отсчета		
  function updateClock() {
    let t = getTimeRemaining(endtime);

//Задаем функцию для добавления 0 к числам до 9 (01, 02 и т.д.)
			function addZero(num){
			if(num <= 9) {
				return '0' + num;
			} else return num;
		};

//Вывод оставшегося времени 
    hours.textContent = addZero(t.hours);
    minutes.textContent = addZero(t.minutes);
    seconds.textContent = addZero(t.seconds);

//Действия, выполняющиеся после завершения отсчета таймера
    if (t.total <= 0) {
	    clearInterval(timeInterval);
	    hours.textContent = '00';
	    minutes.textContent = '00';
	    seconds.textContent = '00';
    } 
};
	updateClock();
};
	initializeClock('timer', deadline);//Запуск таймера по id

/* ПлЛАВНАЯ ПРОКРУТКА */

//Передача в переменную всех элементов html на странице
let elements = document.documentElement,
	body = document.body,//Передаем в переменную body
	links = document.links;//Получаем все якорные ссылки на странице

//Функция опредления нажатой ссылки и расчета перемещения
function calcScroll() {

//Перебор циклом все ссылок и определение той, на которой был сделан клик
  for (let i = 0; i < links.length; i++) {
    links[i].onclick = function(event) {
    	event = event || window.event;//Кросс-браузерность
      //Определение и округление текущего расстояния от верха документа
      let scrollTop = Math.round(body.scrollTop || elements.scrollTop);
      if (this.hash !== '') {
//Предотвращение действия браузера по дефолту при отсутвии атрибута hash у элемента
        event.preventDefault();
//Получение элемента, к которому ведет якорь нажатой ссылки
        let targetElement = document.getElementById(this.hash.substring(1)),
//Задел в 80px, чтобы при прокрутке меню не закрывало заголовок секции
			targetElementTop = -80;
//Вычисление через цикл расстояния от верха до элемента, к которому ведет нажатая ссылка
        while (targetElement.offsetParent) {
          targetElementTop += targetElement.offsetTop;
          targetElement = targetElement.offsetParent;
        }
        //Получение округленного значения расположения элемента
        targetElementTop = Math.round(targetElementTop);
/* Функция запуска плавного перемещения (содержит аргументы: текущее растояние от верха
документа, расстояние от верха документа к контентному блоку, к которому ведет нажатая 
ссылка и сам контентный блок) */
		if (document.body.style.overflow !== 'hidden') {//Предотвращает прокрутку при открытом модальном окне
			smoothScroll(scrollTop, targetElementTop, this.hash);
		}
      }
    };
  }
};
calcScroll();

let timeInterval = 1, //Задаем временной интервал в 1 миллисекунду
		prevScrollTop,
		speed;

//Функция плавной прокрутки
function smoothScroll(from, to, hash) {
/* Если элемент (конечная точка движения) расположен ниже текущей точки экрана,
то scroll ведется с верху вниз (положительное значение), если наоборот, то снизу
вверх (отрицательное значение) */
	if (to > from) {
		speed = 10;
	} else {
		speed = -10;
	}
//Установка интервала движения
  let move = setInterval(function() {
//Получение и округение текущей позиции экрана
    scrollTop = Math.round(body.scrollTop || elements.scrollTop);
//Условия прекращения или продолжения движения
    if (
      prevScrollTop === scrollTop ||
      (to > from && scrollTop >= to) ||
      (to < from && scrollTop <= to)
    ) {
      clearInterval(move);
//Добавление атрибута hash в url после прокрутки (добавляется к адресной строке в браузере)
      history.replaceState(history.state, document.title, location.href.replace(/#.*$/g, '') 
      + hash);

    } else {
      body.scrollTop += speed;
      elements.scrollTop += speed;
/* Передача текущей позиции экрана в переменную, которая при последующих перемещениях
будет играть роль места хранения последней позиции экрана */
      prevScrollTop = scrollTop;
    }
  }, timeInterval);//Передача ранее установленного интервала перемещения
}

/* ОПРЕДЕЛЕНИЕ ТИПА БРАУЗЕРА */

//Получение версии IE или Edge
let version = getIeVersion(),//Задаем функцию определения IE или EDGE в переменную
	browser;
//Присваиваем переменной true или false в зависимости от определения браузера
if (version === false) {
  browser = true;
} else if (version >= 12) {
  browser = false;
} else {
  browser = false;
}

//Функция определения браузера возвращает версию IE или афдыу если браузер другой
function getIeVersion() {
//Определяем, является ли текущий браузер IE
  let ua = window.navigator.userAgent,
		msie = ua.indexOf('MSIE ');

  if (msie > 0) {
//Если IE 10 или младшей версии функция возвращает номер версии
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  let trident = ua.indexOf('Trident/');
  if (trident > 0) {
//Если IE 11 версии функция возвращает номер версии
    let rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  let edge = ua.indexOf('Edge/');
  if (edge > 0) {
//Усли Edge (или IE 12 версии и выше) функция возвращает номер версии
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

//Функция возвращает false,если текущий браузер не IE и не EDGE
  return false;
};

//Проверка на мобильный браузер
let mobileBrowser;

function mobileBrowserCheck() {
//Проверка на конкретный мобильный браузер
		let isMobile = {
	    Android: function() {
	        return navigator.userAgent.match(/Android/i);
	    },
	    BlackBerry: function() {
	        return navigator.userAgent.match(/BlackBerry/i);
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    Opera: function() {
	        return navigator.userAgent.match(/Opera Mini/i);
	    },
	    Windows: function() {
	        return navigator.userAgent.match(/IEMobile/i);
	    },
	    //Проверка на любой мобильный браузер
	    any: function() {
	        return (isMobile.Android() || isMobile.BlackBerry() 
	        		|| isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	    }
	};
//Возврат функцией true, если браузер мобильный
		if(isMobile.any()){
			mobileBrowser = true;
			console.log('Мобильный');
		} else {
			console.log('Не мобильный');
		}
};
mobileBrowserCheck();

/* МОДАЛЬНОЕ ОКНО */

//Задаем переменные кнопки открытия модального окна, оверлея и закрытия
let more = document.querySelector('.more'),
	overlay = document.querySelector('.overlay'),
	close = document.querySelector('.popup-close');

//Открытие модального окна
more.addEventListener('click', function() {
	if (mobileBrowser !== true) {
		this.classList.add('more-splash');
		overlay.style.display = 'block';
		document.body.style.overflow = 'hidden';
		console.log('Скрипт работает');
	} else {
		console.log('Скрипт не работает');
		return false		
	}
});

//Закрытие модального окна
close.addEventListener('click', function() {
	if (mobileBrowser !== true) {
		overlay.style.display = 'none';
		more.classList.remove('more-splash');
		document.body.style.overflow = '';
		console.log('Скрипт работает');
	} else {
		console.log('Скрипт не работает');
		return false
	}
});

//Закрытие модального окна нажатем Esc
document.onkeydown = function(e) {
	if (e.keyCode === 27) {
		overlay.style.display = 'none';
		more.classList.remove('more-splash');
		document.body.style.overflow = '';	        
    }
};

/* ПРИВЯЗКА МОДАЛЬНОГО ОКНА К КНОПКАМ В ТАБАХ */

//Получение псевдомассива кнопок
let descBtns = document.querySelectorAll('.description-btn');

//Функция реализации обработчика события
function descBtnFunc() {
	if (mobileBrowser !== true) {
//Перебор циклом всех кнопок в псевдомассиве
		for (let i = 0; i < descBtns.length; i++) {
//Привязка к кнопкам обработчика события
			descBtns[i].addEventListener('click', function() {
				this.classList.add('more-splash');
				overlay.style.display = 'block';
				document.body.style.overflow = 'hidden';
				console.log('Скрипт работает');
			});
		}
	} else {
		console.log('Скрипт не работает');
		return false
	}
};
descBtnFunc();

});



