class RulesManager {
  constructor() {
    this.rulesTab = null;
    this.rulesContent = null;
    this.isPanelOpen = false;
    this.init();
  }

  init() {
    this.createRulesPanel();
    this.bindEvents();
    this.bindSettingsCloseEvent();
  }

  createRulesPanel() {
    const settingsContainer = document.querySelector('.settings-container');
    if (!settingsContainer) return;

    const sidebar = settingsContainer.querySelector('.settings-sidebar');
    const content = settingsContainer.querySelector('.settings-content');

    if (!sidebar || !content) return;

    const rulesTab = document.createElement('button');
    rulesTab.className = 'rules-tab';
    rulesTab.innerHTML = `<span>ПРАВИЛА ГРИ</span>`;
    sidebar.appendChild(rulesTab);

    const rulesContent = document.createElement('div');
    rulesContent.className = 'rules-content';
    rulesContent.innerHTML = `
      <h3>Як грати?</h3>
      <div class="rules-text">
      
      <div class="rule-section">
        <p class="chapter"><strong>Старт</strong></p>
        <p>
        1. Натисніть кнопку "НОВА ГРА" в головному меню.<br>
        2. Після завантаження сцени, числа з'являться на ігровій панелі у випадковому порядку.<br>
        3. Одна клітинка залишиться порожньою - це ваш робочий простір.</p>
      </div>
      
      
      <div class="rule-section">
        <p class="chapter"><strong>Ігровий процес</strong></p>
        <p>
        - перетягуйте фішки, затиснувши ліву кнопку миші на комп'ютері або пальцем на мобільному;<br>
        - рухати можна тільки ті плитки, що знаходяться поруч з вільним місцем;<br>
        - фішку можна встановити туди, де порожнє місце буде підсвічуватися зеленим;<br>
        - якщо намагаєтеся поставити фішку на фішку - з'явиться червоний хрестик (фішки не можна міняти між собою).</p>
        </div>

         <div class="rule-section">
        <p class="chapter"><strong>Правила</strong></p>
        <p>
        - за один раз можна пересувати лише одну фішку;<br>
        - фішку можна ставити тільки в порожню клітинку;<br>
        - за умовчанням у вас є 5 хвилин на розв'зання (за бажанням таймер можна вимкнути у налаштуваннях);<br>
        - коли таймер закінчиться - ви програли.</p>
         </div>
         
         
         <div class="rule-section">
          <p class="chapter"><strong>Гру завершено!</strong></p>
          <p>
            Ви виграли, коли всі числа стоять у порядку зростання, 
            а порожня клітинка - в правому нижньому куті. Ну і відповідно, якщо ви встигли до того, як закінчився час.
            Сніговичок вас привітає з конфетті!
          </p>
         </div>
         
          <div class="rule-section">
            <p><strong>Порада 1.</strong> 
            Спочатку зберіть верхні ряди, а потім переходьте до нижніх - так простіше!</p>
            
            <p><strong>Порада 2.</strong> 
            Коли збираєте якийсь рядок, то останні дві цифри збирайте разом.
            Наприклад, берете перший ряд, збираєте 1 і 2. А от 3 і 4 переміщайте одночасно. Інакше застрягнете на одному місці й втратите час.</p>
            
            <p><strong>Порада 3.</strong> 
            Експериментуйте, застосовуйте стратегію, пробуйте різні варіанти та підходи до гри.
            Адже її суть якраз і полягає у тому, щоб розвивати логічне мислення, вчитися працювати за визначеним алгоритмом, покращувати уважність і концентрацію.</p>
        
            <p><strong>Порада 4.</strong> 
            Починайте з легкого рівня 3×3 для тренування й використовуйте режим без таймера, щоб звикнути до гри.</p>
        </div>
      </div>
      <h3>Успіхів!</h3>
    `;

    content.appendChild(rulesContent);

    this.rulesTab = rulesTab;
    this.rulesContent = rulesContent;
  }

  bindEvents() {
    if (!this.rulesTab) return;

    this.rulesTab.addEventListener('click', () => {
      this.toggleRulesPanel();
    });
  }

  bindSettingsCloseEvent() {
    const settingsClose = document.getElementById('settingsClose');

    if (settingsClose) {
      settingsClose.addEventListener('click', () => {
        this.closeRulesPanel();
      });
    }
  }

  toggleRulesPanel() {
    if (this.isPanelOpen) {
      this.closeRulesPanel();
    } else {
      this.closeAllPanels();
      this.showRulesPanel();
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

    if (window.aboutManager && window.aboutManager.isAboutPanelOpen()) {
      window.aboutManager.closeAboutPanel();
    }

    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach((content) => content.classList.remove('active'));
    allTabs.forEach((tab) => tab.classList.remove('active'));
  }

  showRulesPanel() {
    const allContents = document.querySelectorAll('.settings-content > div');
    const allTabs = document.querySelectorAll('.settings-sidebar button');

    allContents.forEach((content) => content.classList.remove('active'));
    allTabs.forEach((tab) => tab.classList.remove('active'));

    this.rulesContent.classList.add('active');
    this.rulesTab.classList.add('active');
    this.isPanelOpen = true;
  }

  closeRulesPanel() {
    if (this.rulesContent) {
      this.rulesContent.classList.remove('active');
    }
    if (this.rulesTab) {
      this.rulesTab.classList.remove('active');
    }
    this.isPanelOpen = false;
  }

  isRulesPanelOpen() {
    return this.isPanelOpen;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.rulesManager = new RulesManager();
  }, 100);
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RulesManager;
}
