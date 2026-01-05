class AboutManager {
  constructor() {
    this.aboutTab = null;
    this.aboutContent = null;
    this.isPanelOpen = false;
    this.init();
  }

  init() {
    this.createAboutPanel();
    this.bindEvents();
    this.bindSettingsCloseEvent();
  }

  createAboutPanel() {
    const settingsContainer = document.querySelector('.settings-container');
    if (!settingsContainer) return;

    const sidebar = settingsContainer.querySelector('.settings-sidebar');
    const content = settingsContainer.querySelector('.settings-content');

    if (!sidebar || !content) return;

    const aboutTab = document.createElement('button');
    aboutTab.className = 'about-tab';
    aboutTab.innerHTML = `<span>ПРО ПРОГРАМУ</span>`;
    sidebar.appendChild(aboutTab);

    const aboutContent = document.createElement('div');
    aboutContent.className = 'about-content';
    aboutContent.innerHTML = `
      <h3>SPOTS GAMING</h3>
      <div class="about-text">
        <div class="about-section">
          <h4>П'ятнашки або п'ятнадцять</h4>
          <p>Англійською буде 15 Puzzle - легендарна логічна головоломка, що була винайдена в 1874 році американським поштмейстером Ноєм Чепменом. Гра складається з квадратної рамки, заповненої пронумерованими квадратними плитками, де одна клітинка залишається порожньою для переміщення.</p>
        </div>
        
        <div class="about-section">
          <h4>Історія виникнення</h4>
          <p>У 1880-х роках п'ятнашки викликали справжню манію в Європі та Америці. Головоломка стала настільки популярною, що роботодавці забороняли працівникам приносити її на роботу через зниження продуктивності. Математик Семюель Лойд навіть оголосив нагороду в $1000 за розв'язання певної комбінації, яку пізніше довели як нерозв'язну.</p>
        </div>
      
        <div class="about-section">
          <h4>Математична цінність</h4>
          <p>Гра має важливе математичне значення. Доведено, що з 16!/2 можливих початкових позицій тільки половина є розв'язними. Це пов'язано з поняттям парності перестановок. П'ятнашки стали об'єктом серйозних математичних досліджень у теорії груп та комбінаториці.</p>
        </div>
        
        
        <div class="about-section">
          <h4>Spots - сучасний прототип</h4>
          <p>Класичний типовий екземпляр задачі на логіку в новорічній зимовій тематиці. Збирайте числа послідовно, розвиваючи логіку та просторове уявлення.</p>
        </div>

        <div class="about-section">
          <h4>Які особливості?</h4>
          <p><strong>Три рівні складності:</strong></p>
          <ul>
            <li><strong>3×3 (легкий)</strong> - 8 фішок, гарний варіант для старту.</li>
            <li><strong>4×4 (стандартний)</strong> - 15 фішок, за умовчанням.</li>
            <li><strong>5×5 (складний)</strong> - 24 фішки, для досвідчених.</li>
          </ul>
        </div>

        <div class="about-section">
          <h4>Режими гри</h4>
          <ul>
            <li><strong>На час</strong> - 5 хвилин на розв'язання головоломки. За 30 секунд до кінця з'являється попередження.</li>
            <li><strong>Без обмежень</strong> - тренуйтеся без таймера у власному темпі.</li>
          </ul>
        </div>

        <div class="about-section">
          <h4>Мета гри</h4>
          <p>Розташуйте всі числа підряд від найменшого до найбільшого (зліва направо, зверху вниз), залишивши порожню клітинку в правому нижньому куті.</p>
        </div>

        <div class="about-section">
          <h4>Керування</h4>
          <ul>
            <li><strong>На комп'ютері:</strong> наведіть курсор на фішку, затисніть ліву кнопку миші і перетягніть фішку.</li>
            <li><strong>На мобільному:</strong> затисніть пальцем фішку і перетягніть.</li>
            <li>Рухати можна лише фішки, що знаходяться поруч з порожньою клітинкою.</li>
            <li>Зелений колір - можна поставити, червоний - заборонено.</li>
          </ul>
        </div>

        <div class="about-section">
          <h4>Аудіо-супровід</h4>
          <ul>
            <li>Фонова музика для головного меню та ігрового процесу.</li>
            <li>Звукові ефекти: кліки, переміщення фішок, перемога, поразка.</li>
            <li>Окреме налаштування гучності музики та звуків.</li>
            <li>Попереджувальний сигнал за 30 секунд до кінця часу.</li>
          </ul>
        </div>

        <div class="about-section">
          <h4>Графіка та оформлення</h4>
          <ul>
            <li>Векторний мультяшний зимовий стиль без зайвих компонентів декору.</li>
            <li>Анімовані відеофони: засніжений будинок у меню, ялинка зі сніговиком у грі.</li>
            <li>Святковий сніговичок-талісман при перемозі та поразці.</li>
            <li>Конфетті з новорічних предметів у разі виграшу.</li>
            <li>Плавні анімації переходів та появи елементів.</li>
          </ul>
        </div>
        
        <div class="about-section">
          <h4>Тематика</h4>
          <p>Гра виконана в новорічно-зимовій стилістиці. Чудово підходить для відпочинку та тренування розуму в холодні зимові вечори. Нічого складного та зайвого, привабливий інтерфейс та зручне управління.</p>
        
        </div>

        <div class="about-section">
          <h4>Функції інтерфейсу</h4>
          <ul>
            <li><strong>Пауза</strong> - зупиніть гру в будь-який момент.</li>
            <li><strong>Перезапуск</strong> - почніть нову гру з перемішаними фішками.</li>
            <li><strong>Налаштування</strong> - параметри доступні як у головному меню, так і під час гри.</li>
            <li><strong>Назад</strong> - повернення до головного меню з підтвердженням.</li>
            <li><strong>Таймер</strong> - відображає залишковий час (при увімкненому режимі).</li>
          </ul>
        </div>

        <div class="about-section">
          <h4>Умови перемоги та поразки</h4>
          <p><strong>Перемога:</strong></p>
          <ul>
            <li>Всі числа розташовані по порядку.</li>
            <li>Порожня клітинка в правому нижньому куті.</li>
            <li>З'являється вітальний екран з конфетті.</li>
          </ul>
          <p><strong>Поразка:</strong></p>
          <ul>
            <li>Час вичерпано (якщо таймер увімкнений).</li>
            <li>Відображається екран поразки.</li>
            <li>Можна почати нову спробу.</li>
          </ul>
        </div>

        <div class="about-section">
          <h4>Збереження налаштувань</h4>
          <p>Всі ваші налаштування (гучність, складність, режим таймера) автоматично зберігаються в браузері та завантажуються при наступному запуску гри.</p>
        </div>

        <div class="about-section">
          <h4>Корисні поради</h4>
          <ul>
            <li>Спочатку збирайте верхні ряди, потім переходьте до нижніх.</li>
            <li>Останні дві цифри в ряду збирайте одночасно.</li>
            <li>Експериментуйте з різними стратегіями.</li>
            <li>Починайте з легкого рівня 3×3 для тренування.</li>
            <li>Використовуйте режим без таймера, щоб звикнути до гри.</li>
          </ul>
        </div>

        <div class="about-section">
          <h4>Сумісність</h4>
          <ul>
            <li>Адаптивний дизайн для всіх пристроїв.</li>
            <li>Підтримка сенсорних екранів.</li>
            <li>Працює в усіх сучасних браузерах.</li>
            <li>Потребує інтернет-підключення.</li>
          </ul>
        </div>

        <div class="about-section about-footer">
          <p>© 2025-2026 SPOTS GAMING</p>
          <p>powered by <strong>voitsekh</strong></p>
        </div>
      </div>
    `;

    content.appendChild(aboutContent);

    this.aboutTab = aboutTab;
    this.aboutContent = aboutContent;
  }

  bindEvents() {
    if (!this.aboutTab) return;

    this.aboutTab.addEventListener('click', () => {
      this.toggleAboutPanel();
    });
  }

  bindSettingsCloseEvent() {
    const settingsClose = document.getElementById('settingsClose');

    if (settingsClose) {
      settingsClose.addEventListener('click', () => {
        this.closeAboutPanel();
      });
    }
  }

  toggleAboutPanel() {
    if (this.isPanelOpen) {
      this.closeAboutPanel();
    } else {
      this.closeAllPanels();
      this.showAboutPanel();
    }
  }

  closeAllPanels() {
    if (window.soundManager && window.soundManager.isSoundPanelOpen()) {
      window.soundManager.closeSoundPanel();
    }

    if (
      window.gameplayManager &&
      window.gameplayManager.isGameplayPanelOpen()
    ) {
      window.gameplayManager.closeGameplayPanel();
    }

    if (window.rulesManager && window.rulesManager.isRulesPanelOpen()) {
      window.rulesManager.closeRulesPanel();
    }

    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach((content) => content.classList.remove('active'));
    allTabs.forEach((tab) => tab.classList.remove('active'));
  }

  showAboutPanel() {
    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach((content) => content.classList.remove('active'));
    allTabs.forEach((tab) => tab.classList.remove('active'));

    this.aboutContent.classList.add('active');
    this.aboutTab.classList.add('active');
    this.isPanelOpen = true;
  }

  closeAboutPanel() {
    if (this.aboutContent) {
      this.aboutContent.classList.remove('active');
    }
    if (this.aboutTab) {
      this.aboutTab.classList.remove('active');
    }
    this.isPanelOpen = false;
  }

  isAboutPanelOpen() {
    return this.isPanelOpen;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.aboutManager = new AboutManager();
  }, 100);
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AboutManager;
}
