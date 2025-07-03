import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const LANG_PACK = {
    'ru': {
        'welcome_title': 'Симулятор Хладни v8.0 (GPU)',
        'welcome_body': `
            <p>Добро пожаловать в GPU-версию интерактивного симулятора узоров Хладни. Все основные вычисления физики теперь выполняются на вашей видеокарте, что позволяет достичь значительно большей детализации и производительности.</p>
            <p>Проект поставляется по лицензии <b>"АЩЕ ПОХУЙ"</b>, т.е. бесплатная, поскольку это сборная солянка из всех практических работ в интернете. Моя задача была просто свести всю хуйню воедино, что, по сути, и получилось благодаря двум ИИ — Gemini и Grok. Проект мог бы быть масштабнее, но пока у меня ограничения в 1 000 000 токенов, но и этого было достаточно.</p>
            <p>Практических применений много, т.к. проект является уникальной интерактивной мазафакой с точки зрения Физики и других Алгебраических штук.</p>
            <p>Отдельно спасибо: Даниилу Дмитриевичу =)</p>
            <p>Для связи со мной <b>https://t.me/unknown_sector</b></p>
            <p>В будущем, когда будет время, буду дорабатывать проект, а пока я прячусь от налоговой. Но донат никто не отменял, поэтому вот адрес моего кошелька TON в телеге: <b>UQAY5_p2plWbshvrITsPk5TJ4CKBneJImdVUV-8-MBOA4Lhh</b></p>
            <div class="welcome-image-container">
                <img src="./img/111.png" alt="Chladni Pattern Example" border="0" />
                <img src="./img/222.jpg" alt="Project Logo" border="0" />
            </div>
        `,
        'lang_toggle': 'Switch to English',
        'show_prompt': 'Промпт Проекта',
        'close_welcome': 'Начать',
        'prompt_title': 'Промпт / Техническое Задание Проекта',
        'close_modal': 'Закрыть',
        'toggle_left_panel_show': 'Скрыть левую панель',
        'toggle_left_panel_hide': 'Показать левую панель',
        'toggle_right_panel_show': 'Скрыть правую панель',
        'toggle_right_panel_hide': 'Показать правую панель',
        'btn_show_welcome': 'Помощь / Welcome',
        'info_controls': 'Удерживайте ЛКМ и двигайте для вращения камеры.<br>Используйте Колесо Мыши для приближения/отдаления.',
        'info_version': 'Симулятор v8.0 (GPU).',
        'legend_main_params': 'Основные параметры',
        'label_freq_slider': 'Частота (ползунок):',
        'label_freq_input': 'Частота (ввод Гц):',
        'btn_set': 'Установить',
        'label_sim_speed': 'Скорость симуляции:',
        'label_presets': 'Предустановки (m,n для круга):',
        'preset_custom': 'Свои m, n (сейчас: {m},{n})',
        'preset_custom_inactive': 'Свои m, n (неактивно)',
        'preset_lada': 'Звезда Лады (4,2)',
        'param_m': 'Мода m:',
        'btn_set_m': 'Уст. m',
        'param_n': 'Мода n:',
        'btn_set_n': 'Уст. n',
        'legend_sim_controls': 'Управление симуляцией',
        'btn_desktop_audio_on': 'Перехват звука: Вкл', 'btn_desktop_audio_off': 'Перехват звука: Выкл',
        'btn_sound_on': 'Звук: Вкл', 'btn_sound_off': 'Звук: Выкл',
        'btn_freeze_on': 'Частицы: Замороз.', 'btn_freeze_off': 'Частицы: Движ.',
        'btn_subs_on': 'Субтитры: Вкл', 'btn_subs_off': 'Субтитры: Выкл',
        'btn_shadows_on': 'Тени: Вкл', 'btn_shadows_off': 'Тени: Выкл',
        'btn_dyn_density_on': 'Динам. плотность: Вкл', 'btn_dyn_density_off': 'Динам. плотность: Выкл',
        'btn_culling_on': 'Скрытие частиц: Вкл', 'btn_culling_off': 'Скрытие частиц: Выкл',
        'btn_fdm_opt_on': 'Опт. FDM: Вкл', 'btn_fdm_opt_off': 'Опт. FDM: Выкл',
        'btn_full_reset': 'ПОЛНЫЙ СБРОС',
        'label_fdm_progress': 'Прогресс FDM шага:',
        'mode_modal': 'Режим: Модальный', 'mode_point': 'Режим: Точечный (частота)', 'mode_audio': 'Режим: Аудиофайл', 'mode_mic': 'Режим: Микрофон', 'mode_piano': 'Режим: Пианино', 'mode_desktop_audio': 'Режим: Захват Аудио',
        'legend_plate_rotation': 'Вращение пластины',
        'label_rotation_speed': 'Скорость вращения:',
        'btn_stop_rotation': 'Остановить вращение',
        'legend_audio_input': 'Аудиовход',
        'label_audio_file': 'Загрузить аудиофайл(ы):',
        'btn_play_track': 'Воспр. трек/плейлист',
        'btn_stop_audio': 'Остановить аудио',
        'btn_pause': 'Пауза', 'btn_resume': 'Продолжить',
        'btn_prev_track': 'Пред. трек',
        'btn_next_track': 'След. трек',
        'audio_info_none': 'Аудио не загружено',
        'btn_mic_on': 'Микрофон: Вкл', 'btn_mic_off': 'Микрофон: Выкл',
        'mic_info': 'Для использования микрофона может потребоваться разрешение браузера.',
        'label_audio_progress': 'Прогресс аудио:',
        'pitch_detected': 'Определено:', 'pitch_note': 'Нота:', 'pitch_detune': 'Отклонение:',
        'bpm_confidence': 'Увер:',
        'legend_piano': 'Виртуальное Пианино',
        'label_octave': 'Октава:',
        'octave_2': 'Контроктава', 'octave_3': 'Малая', 'octave_4': 'Первая', 'octave_5': 'Вторая', 'octave_6': 'Третья',
        'piano_inactive': 'Пианино неактивно',
        'piano_hint': 'Клавиатура: Ср. ряд - белые, Верх. ряд - черные. Shift + Клавиша = Октава выше.',
        'adv_title': 'Продвинутые настройки',
        'legend_plate_physics': 'Физика пластины',
        'adv_plate_thickness': 'Толщина (м):', 'adv_plate_density': 'Плотность (кг/м³):', 'adv_emodulus': 'Модуль Юнга (Па):', 'adv_poisson': 'Коэф. Пуассона:',
        'legend_fdm_settings': 'Настройки FDM',
        'adv_min_grid': 'Мин. размер сетки:', 'adv_max_grid': 'Макс. размер сетки:', 'adv_fdm_steps': 'Баз. макс. шагов FDM/кадр:', 'adv_stability_factor': 'Фактор стабильности FDM (dt):', 'adv_damping_factor': 'Фактор затухания FDM:',
        'legend_audio_analysis': 'Настройки Аудиоанализа',
        'adv_bpm_window': 'Окно детекции пиков BPM:',
        'legend_particle_dynamics': 'Динамика частиц',
        'adv_particle_count': 'Кол-во частиц (макс.):', 'adv_force_multiplier': 'Множитель силы (база):', 'adv_damping_base': 'Демпфирование (база):', 'adv_particle_size': 'Размер частиц:', 'adv_enable_repulsion': 'Вкл. отталкивание частиц:', 'adv_repulsion_radius': 'Радиус отталкивания:', 'adv_repulsion_strength': 'Сила отталкивания:', 'adv_restitution': 'Упругость столкновения:', 'adv_max_speed': 'Макс. скорость частиц:', 'adv_max_neighbors': 'Макс. соседей для отталк.:',
        'legend_excitation_amp': 'Амплитуда возбуждения',
        'adv_base_amp': 'Базовая амплитуда:', 'adv_low_cutoff': 'Нижний порог частоты (Гц):', 'adv_high_cutoff': 'Верхний порог частоты (Гц):', 'adv_max_factor': 'Макс. множитель:', 'adv_min_factor': 'Мин. множитель:',
        'legend_particle_viz': 'Визуализация частиц',
        'adv_deform_scale': 'Масштаб "прыжка":', 'adv_max_amp': 'Макс. "прыжок":',
        'btn_reset_adv': 'Сбросить продвинутые настройки'
    },
    'en': {
        'welcome_title': 'Chladni Simulator v8.0 (GPU)',
        'welcome_body': `
            <p>Welcome to the GPU-powered version of the interactive Chladni pattern simulator. All core physics calculations are now performed on your graphics card, allowing for significantly greater detail and performance.</p>
            <p>The project is provided under the <b>"I DON'T GIVE A FUCK"</b> license, meaning it's free since it's a hodgepodge of all practical works on the internet. My task was just to bring all this bullshit together, which I basically did, thanks to two AIs — Gemini and Grok. The project could have been more ambitious, but for now, I'm limited to 1,000,000 tokens, though that was enough.</p>
            <p>There are many practical applications, as the project is a unique interactive motherfucker from the perspective of Physics and other Algebraic stuff.</p>
            <p>Special thanks to: Daniil Dmitrievich =)</p>
            <p>4 contact with me: <b>https://t.me/unknown_sector</b></p>
            <p>In the future, when I have time, I'll continue to work on the project, but for now, I'm hiding from the tax authorities. However, donations are always welcome, so here is my TON wallet address on Telegram: <b>UQAY5_p2plWbshvrITsPk5TJ4CKBneJImdVUV-8-MBOA4Lhh</b></p>
            <div class="welcome-image-container">
                <img src="./img/111.png" alt="Chladni Pattern Example" border="0" />
                <img src="./img/222.jpg" alt="Project Logo" border="0" />
            </div>
        `,
        'lang_toggle': 'Переключить на Русский',
        'show_prompt': 'Project Prompt',
        'close_welcome': 'Start',
        'prompt_title': 'Project Prompt / Technical Task',
        'close_modal': 'Close',
        'toggle_left_panel_show': 'Hide left panel',
        'toggle_left_panel_hide': 'Show left panel',
        'toggle_right_panel_show': 'Hide right panel',
        'toggle_right_panel_hide': 'Show right panel',
        'btn_show_welcome': 'Help / Помощь',
        'info_controls': 'Hold Left Mouse Button and move to rotate the camera.<br>Use the Mouse Wheel to zoom in/out.',
        'info_version': 'Simulator v8.0 (GPU).',
        'legend_main_params': 'Main Parameters',
        'label_freq_slider': 'Frequency (slider):',
        'label_freq_input': 'Frequency (Hz input):',
        'btn_set': 'Set',
        'label_sim_speed': 'Simulation Speed:',
        'label_presets': 'Presets (m,n for circle):',
        'preset_custom': 'Custom m, n (now: {m},{n})',
        'preset_custom_inactive': 'Custom m, n (inactive)',
        'preset_lada': 'Star of Lada (4,2)',
        'param_m': 'Mode m:',
        'btn_set_m': 'Set m',
        'param_n': 'Mode n:',
        'btn_set_n': 'Set n',
        'legend_sim_controls': 'Simulation Controls',
        'btn_desktop_audio_on': 'Capture Audio: On', 'btn_desktop_audio_off': 'Capture Audio: Off',
        'btn_sound_on': 'Sound: On', 'btn_sound_off': 'Sound: Off',
        'btn_freeze_on': 'Particles: Frozen', 'btn_freeze_off': 'Particles: Move',
        'btn_subs_on': 'Subtitles: On', 'btn_subs_off': 'Subtitles: Off',
        'btn_shadows_on': 'Shadows: On', 'btn_shadows_off': 'Shadows: Off',
        'btn_dyn_density_on': 'Dyn. Density: On', 'btn_dyn_density_off': 'Dyn. Density: Off',
        'btn_culling_on': 'Culling: On', 'btn_culling_off': 'Culling: Off',
        'btn_fdm_opt_on': 'FDM Opt: On', 'btn_fdm_opt_off': 'FDM Opt: Off',
        'btn_full_reset': 'FULL RESET',
        'label_fdm_progress': 'FDM Step Progress:',
        'mode_modal': 'Mode: Modal', 'mode_point': 'Mode: Point (Frequency)', 'mode_audio': 'Mode: Audio File', 'mode_mic': 'Mode: Microphone', 'mode_piano': 'Mode: Piano', 'mode_desktop_audio': 'Mode: Audio Capture',
        'legend_plate_rotation': 'Plate Rotation',
        'label_rotation_speed': 'Rotation Speed:',
        'btn_stop_rotation': 'Stop Rotation',
        'legend_audio_input': 'Audio Input',
        'label_audio_file': 'Load audio file(s):',
        'btn_play_track': 'Play Track/Playlist',
        'btn_stop_audio': 'Stop Audio',
        'btn_pause': 'Pause', 'btn_resume': 'Resume',
        'btn_prev_track': 'Prev. Track',
        'btn_next_track': 'Next Track',
        'audio_info_none': 'No audio loaded',
        'btn_mic_on': 'Microphone: On', 'btn_mic_off': 'Microphone: Off',
        'mic_info': 'Using the microphone may require browser permission.',
        'label_audio_progress': 'Audio Progress:',
        'pitch_detected': 'Detected:', 'pitch_note': 'Note:', 'pitch_detune': 'Detune:',
        'bpm_confidence': 'Conf:',
        'legend_piano': 'Virtual Piano',
        'label_octave': 'Octave:',
        'octave_2': 'Contra', 'octave_3': 'Small', 'octave_4': 'First', 'octave_5': 'Second', 'octave_6': 'Third',
        'piano_inactive': 'Piano inactive',
        'piano_hint': 'Keyboard: Middle row - white, Top row - black. Shift + Key = Octave up.',
        'adv_title': 'Advanced Settings',
        'legend_plate_physics': 'Plate Physics',
        'adv_plate_thickness': 'Thickness (m):', 'adv_plate_density': 'Density (kg/m³):', 'adv_emodulus': 'Young\'s Modulus (Pa):', 'adv_poisson': 'Poisson\'s Ratio:',
        'legend_fdm_settings': 'FDM Settings',
        'adv_min_grid': 'Min. Grid Size:', 'adv_max_grid': 'Max. Grid Size:', 'adv_fdm_steps': 'Base Max FDM Steps/Frame:', 'adv_stability_factor': 'FDM Stability Factor (dt):', 'adv_damping_factor': 'FDM Damping Factor:',
        'legend_audio_analysis': 'Audio Analysis Settings',
        'adv_bpm_window': 'BPM Peak Detection Window:',
        'legend_particle_dynamics': 'Particle Dynamics',
        'adv_particle_count': 'Particle Count (Max):', 'adv_force_multiplier': 'Force Multiplier (Base):', 'adv_damping_base': 'Damping (Base):', 'adv_particle_size': 'Particle Size:', 'adv_enable_repulsion': 'Enable Repulsion:', 'adv_repulsion_radius': 'Repulsion Radius:', 'adv_repulsion_strength': 'Repulsion Strength:', 'adv_restitution': 'Collision Restitution:', 'adv_max_speed': 'Max Particle Speed:', 'adv_max_neighbors': 'Max Repulsion Neighbors:',
        'legend_excitation_amp': 'Excitation Amplitude',
        'adv_base_amp': 'Base Amplitude:', 'adv_low_cutoff': 'Low Freq. Cutoff (Hz):', 'adv_high_cutoff': 'High Freq. Cutoff (Hz):', 'adv_max_factor': 'Max. Multiplier:', 'adv_min_factor': 'Min. Multiplier:',
        'legend_particle_viz': 'Particle Visualization',
        'adv_deform_scale': '"Jump" Scale:', 'adv_max_amp': 'Max. "Jump":',
        'btn_reset_adv': 'Reset Advanced Settings'
    }
};

const TOOLTIP_TEXTS = {
    'desktop_audio': {
        ru: { title: 'Захват Аудио с ПК', body: 'Позволяет использовать любой звук, воспроизводимый на вашем компьютере (из другой вкладки браузера, плеера, игры) как источник для симуляции. <b>КРИТИЧЕСКИ ВАЖНО:</b> в появившемся окне выберите вкладку "Весь экран" или конкретное окно приложения, а затем <b>обязательно поставьте галочку "Поделиться системным аудио"</b> в левом нижнем углу.' },
        en: { title: 'Desktop Audio Capture', body: 'Allows using any sound playing on your computer (from another browser tab, player, game) as the source for the simulation. <b>CRITICALLY IMPORTANT:</b> In the dialog that appears, select the "Entire Screen" tab or a specific application window, and then <b>be sure to check the "Share system audio" box</b> in the lower-left corner.' }
    },
    'frequency': {
        ru: { title: 'Частота (Ползунок)', body: 'Основной способ находить резонансные частоты. Плавно изменяйте частоту возбуждения, чтобы увидеть, как узоры Хладни появляются и исчезают. Каждому стабильному узору соответствует своя резонансная частота.' },
        en: { title: 'Frequency (Slider)', body: 'The primary way to find resonant frequencies. Smoothly change the excitation frequency to see how Chladni patterns appear and disappear. Each stable pattern corresponds to its own resonant frequency.' }
    },
    'frequency_input': {
        ru: { title: 'Точный Ввод Частоты', body: 'Используйте это поле для ввода точного значения частоты в Герцах (Гц). Это полезно, если вы знаете конкретную резонансную частоту, которую хотите воспроизвести, или для возврата к ранее найденному узору.' },
        en: { title: 'Precise Frequency Input', body: 'Use this field to enter an exact frequency value in Hertz (Hz). This is useful if you know a specific resonant frequency you want to reproduce or to return to a previously found pattern.' }
    },
    'simulation_speed': {
        ru: { title: 'Скорость Симуляции', body: 'Управляет скоростью течения времени в симуляции. Значение > 1.0 ускоряет движение частиц и формирование узора, а значение < 1.0 — замедляет. Не влияет на частоту звука, только на визуальную динамику.' },
        en: { title: 'Simulation Speed', body: 'Controls the flow of time in the simulation. A value > 1.0 speeds up particle movement and pattern formation, while a value < 1.0 slows it down. It does not affect the sound frequency, only the visual dynamics.' }
    },
    'presets': {
        ru: { title: 'Предустановки Узоров', body: 'Быстрый способ выбрать классические узоры Хладни для круглой пластины. Каждая опция устанавливает соответствующие модальные параметры "m" и "n", которые однозначно определяют геометрию узора и его резонансную частоту.' },
        en: { title: 'Pattern Presets', body: 'A quick way to select classic Chladni patterns for a circular plate. Each option sets the corresponding modal parameters "m" and "n", which uniquely define the pattern\'s geometry and its resonant frequency.' }
    },
    'param_m': {
        ru: { title: 'Модальный параметр "m"', body: 'Определяет количество диаметральных узловых линий (линий, проходящих через центр), которые делят узор на сектора. "m" должно быть целым неотрицательным числом (0, 1, 2...). Увеличивайте "m" для получения более "лучистых" узоров.' },
        en: { title: 'Modal Parameter "m"', body: 'Determines the number of diametral nodal lines (lines passing through the center) that divide the pattern into sectors. "m" must be a non-negative integer (0, 1, 2...). Increase "m" to get more "ray-like" patterns.' }
    },
    'param_n': {
        ru: { title: 'Модальный параметр "n"', body: 'Определяет количество круговых узловых линий. "n" должно быть целым положительным числом (1, 2, 3...). Увеличение "n" добавляет концентрические кольца, на которых частицы остаются в покое.' },
        en: { title: 'Modal Parameter "n"', body: 'Determines the number of circular nodal lines. "n" must be a positive integer (1, 2, 3...). Increasing "n" adds concentric rings where particles remain at rest.' }
    },
    'fdm_progress': {
        ru: { title: 'Прогресс Шага Симуляции (FDM)', body: 'Показывает, насколько интенсивно центральный процессор (CPU) рассчитывает колебания пластины в данный момент. Чем выше частота, тем больше вычислений требуется, и тем активнее будет этот индикатор.' },
        en: { title: 'Simulation Step Progress (FDM)', body: 'Shows how intensively the central processor (CPU) is calculating the plate\'s vibrations at the moment. The higher the frequency, the more calculations are required, and the more active this indicator will be.' }
    },
    'rotation_speed': {
        ru: { title: 'Скорость Вращения Пластины', body: 'Заставляет пластину вращаться вокруг своей оси. Это чисто визуальный эффект, который не влияет на физику узоров, но позволяет лучше рассмотреть их со всех сторон.' },
        en: { title: 'Plate Rotation Speed', body: 'Causes the plate to rotate around its axis. This is a purely visual effect that does not affect the physics of the patterns but allows you to view them from all sides.' }
    },
    'audio_file': {
        ru: { title: 'Анализ Аудиофайла', body: 'Загрузите аудиофайл (MP3, WAV и др.) для анализа. Симулятор будет в реальном времени определять основную частоту звука и использовать ее для возбуждения пластины. Также будет предпринята попытка найти текст песни (субтитры).' },
        en: { title: 'Audio File Analysis', body: 'Load an audio file (MP3, WAV, etc.) for analysis. The simulator will determine the fundamental frequency of the sound in real-time and use it to excite the plate. It will also attempt to find the song lyrics (subtitles).' }
    },
    'mic_input': {
        ru: { title: 'Анализ с Микрофона', body: 'Используйте звук с вашего микрофона для управления симуляцией. Попробуйте напеть ноту или поднести источник звука к микрофону, чтобы увидеть, как узоры реагируют на ваш голос или музыку.' },
        en: { title: 'Microphone Analysis', body: 'Use the sound from your microphone to control the simulation. Try singing a note or bringing a sound source close to the microphone to see how the patterns react to your voice or music.' }
    },
    'audio_progress': {
        ru: { title: 'Прогресс Воспроизведения', body: 'Показывает текущую позицию в загруженном аудиофайле. Вы можете перематывать трек, перетаскивая этот ползунок.' },
        en: { title: 'Playback Progress', body: 'Shows the current position in the loaded audio file. You can seek through the track by dragging this slider.' }
    },
    'piano_octave': {
        ru: { title: 'Выбор Октавы', body: 'Изменяет высоту нот, играемых на виртуальном пианино и с клавиатуры компьютера. "Первая октава" является стандартной для фортепиано.' },
        en: { title: 'Octave Selection', body: 'Changes the pitch of the notes played on the virtual piano and with the computer keyboard. The "First Octave" is standard for piano.' }
    },
    'piano_keys': {
        ru: { title: 'Виртуальное Пианино', body: 'Нажимайте на клавиши мышью или используйте клавиатуру компьютера (средний ряд - белые, верхний - черные), чтобы генерировать узоры, соответствующие определенным нотам. Удерживайте Shift для игры на октаву выше.' },
        en: { title: 'Virtual Piano', body: 'Click the keys with your mouse or use the computer keyboard (middle row - white keys, top row - black keys) to generate patterns corresponding to specific notes. Hold Shift to play one octave higher.' }
    },
    'adv_plate_thickness': {
        ru: { title: 'Толщина Пластины', body: 'Физическая толщина пластины в метрах. Более толстые пластины жестче, что приводит к увеличению скорости распространения волн и, как следствие, к более высоким резонансным частотам для тех же узоров (m,n).' },
        en: { title: 'Plate Thickness', body: 'The physical thickness of the plate in meters. Thicker plates are stiffer, which leads to a higher wave propagation speed and, consequently, higher resonant frequencies for the same patterns (m,n).' }
    },
    'adv_plate_density': {
        ru: { title: 'Плотность Материала', body: 'Плотность материала пластины в кг/м³. Более плотные материалы (например, сталь по сравнению с алюминием) более инертны. Это замедляет волны и понижает резонансные частоты.' },
        en: { title: 'Material Density', body: 'The density of the plate material in kg/m³. Denser materials (e.g., steel compared to aluminum) are more inert. This slows down the waves and lowers the resonant frequencies.' }
    },
    'adv_emodulus': {
        ru: { title: 'Модуль Юнга', body: 'Характеристика упругости материала, показывающая его жесткость. Чем выше модуль Юнга (например, у стали он выше, чем у алюминия), тем быстрее распространяются волны и тем выше резонансные частоты.' },
        en: { title: 'Young\'s Modulus', body: 'A measure of a material\'s stiffness. The higher the Young\'s modulus (e.g., steel is higher than aluminum), the faster the waves propagate and the higher the resonant frequencies.' }
    },
    'adv_poisson': {
        ru: { title: 'Коэффициент Пуассона', body: 'Описывает, насколько материал сжимается в поперечном направлении при растяжении в продольном. Влияет на изгибную жесткость пластины и незначительно изменяет резонансные частоты.' },
        en: { title: 'Poisson\'s Ratio', body: 'Describes how much a material compresses in the transverse direction when stretched longitudinally. It affects the flexural rigidity of the plate and slightly alters the resonant frequencies.' }
    },
    'adv_min_grid': {
        ru: { title: 'Мин. Размер Сетки', body: 'Минимальный размер расчетной сетки (например, 31x31), используемой для низких частот. Меньшие значения снижают нагрузку на CPU, но могут ухудшить детализацию узоров.' },
        en: { title: 'Min. Grid Size', body: 'The minimum size of the calculation grid (e.g., 31x31) used for low frequencies. Smaller values reduce CPU load but may decrease pattern detail.' }
    },
    'adv_max_grid': {
        ru: { title: 'Макс. Размер Сетки', body: 'Максимальный размер расчетной сетки (например, 121x121), используемой для высоких частот. Более высокие значения позволяют точно моделировать короткие волны, но значительно увеличивают нагрузку на CPU.' },
        en: { title: 'Max. Grid Size', body: 'The maximum size of the calculation grid (e.g., 121x121) used for high frequencies. Larger values allow for accurate modeling of short waves but significantly increase CPU load.' }
    },
    'adv_fdm_steps': {
        ru: { title: 'Шаги FDM / Кадр', body: 'Базовое количество шагов численного моделирования, выполняемых за один кадр анимации. Большее число шагов повышает стабильность симуляции на высоких частотах, но требует больше ресурсов.' },
        en: { title: 'FDM Steps / Frame', body: 'The base number of numerical simulation steps performed per animation frame. A higher number of steps improves simulation stability at high frequencies but requires more resources.' }
    },
    'adv_stability_factor': {
        ru: { title: 'Фактор Стабильности (dt)', body: 'Множитель для расчета шага по времени (dt) в симуляции. Меньшие значения делают симуляцию более стабильной, но медленной, так как требуется больше шагов. Слишком большие значения могут привести к "взрыву" симуляции.' },
        en: { title: 'Stability Factor (dt)', body: 'A multiplier for calculating the time step (dt) in the simulation. Smaller values make the simulation more stable but slower, as more steps are required. Values that are too large can cause the simulation to "explode".' }
    },
    'adv_damping_factor': {
        ru: { title: 'Затухание FDM', body: 'Имитирует внутреннее трение в материале пластины, заставляя колебания со временем затухать. Слишком низкое значение может привести к нестабильности, а слишком высокое - "заглушит" узоры.' },
        en: { title: 'FDM Damping', body: 'Simulates internal friction in the plate material, causing vibrations to decay over time. A value that is too low can lead to instability, while a value that is too high will "dampen" the patterns.' }
    },
    'adv_bpm_window': {
        ru: { title: 'Окно Детекции BPM', body: 'Размер "окна" истории (в сэмплах), используемого для поиска пиков при анализе ритма (BPM). Увеличение может сделать определение более стабильным, но менее отзывчивым к смене темпа.' },
        en: { title: 'BPM Detection Window', body: 'The size of the history "window" (in samples) used to find peaks when analyzing the rhythm (BPM). Increasing it can make detection more stable but less responsive to tempo changes.' }
    },
    'adv_particle_count': {
        ru: { title: 'Количество Частиц', body: 'Максимальное количество частиц (песка) в симуляции. Большее количество создает более четкие и детализированные узоры, но сильно влияет на производительность.' },
        en: { title: 'Particle Count', body: 'The maximum number of particles (sand) in the simulation. A larger quantity creates clearer and more detailed patterns but heavily impacts performance.' }
    },
    'adv_force_multiplier': {
        ru: { title: 'Множитель Силы', body: 'Базовый множитель для силы, которая отталкивает частицы от вибрирующих участков к узловым линиям. Увеличьте, чтобы частицы двигались быстрее и энергичнее.' },
        en: { title: 'Force Multiplier', body: 'The base multiplier for the force that pushes particles from vibrating areas to the nodal lines. Increase it to make the particles move faster and more energetically.' }
    },
    'adv_damping_base': {
        ru: { title: 'Демпфирование Частиц', body: 'Имитирует трение, замедляющее частицы (значение < 1.0). Чем ближе к 1, тем дольше частицы сохраняют свою скорость. Слишком низкие значения заставят их быстро остановиться.' },
        en: { title: 'Particle Damping', body: 'Simulates friction that slows down the particles (value < 1.0). The closer to 1, the longer the particles retain their velocity. Values that are too low will cause them to stop quickly.' }
    },
    'adv_particle_size': {
        ru: { title: 'Размер Частиц', body: 'Визуальный размер каждой частицы. Не влияет на физику, только на отображение. Подберите размер для наилучшего визуального результата.' },
        en: { title: 'Particle Size', body: 'The visual size of each particle. Does not affect the physics, only the display. Adjust the size for the best visual result.' }
    },
    'adv_enable_repulsion': {
        ru: { title: 'Отталкивание Частиц', body: 'Включает/выключает силу отталкивания между частицами. Когда включено, частицы ведут себя более "жидко" и не скапливаются в одной точке, распределяясь вдоль узловых линий.' },
        en: { title: 'Particle Repulsion', body: 'Enables/disables the repulsive force between particles. When enabled, particles behave more "fluidly" and do not clump together at a single point, distributing themselves along the nodal lines.' }
    },
    'adv_repulsion_radius': {
        ru: { title: 'Радиус Отталкивания', body: 'Расстояние, на котором частицы начинают отталкивать друг друга. Больший радиус создает более "разреженные" узоры.' },
        en: { title: 'Repulsion Radius', body: 'The distance at which particles begin to repel each other. A larger radius creates more "sparse" patterns.' }
    },
    'adv_repulsion_strength': {
        ru: { title: 'Сила Отталкивания', body: 'Насколько сильно частицы отталкиваются друг от друга в пределах радиуса. Увеличьте для более выраженного эффекта "жидкости".' },
        en: { title: 'Repulsion Strength', body: 'How strongly particles repel each other within the radius. Increase for a more pronounced "fluid" effect.' }
    },
    'adv_restitution': {
        ru: { title: 'Упругость Столкновения', body: 'Коэффициент упругости (0 до 1) при столкновении частиц с краем пластины. 0 - абсолютно неупругое столкновение (частица "прилипает"), 1 - абсолютно упругое (отскакивает без потерь).' },
        en: { title: 'Collision Restitution', body: 'The coefficient of restitution (0 to 1) for particle collisions with the edge of the plate. 0 is a perfectly inelastic collision (particle "sticks"), 1 is a perfectly elastic collision (bounces with no loss).' }
    },
    'adv_max_speed': {
        ru: { title: 'Макс. Скорость Частиц', body: 'Ограничивает максимальную скорость движения частиц, предотвращая их "вылет" из-за слишком больших сил.' },
        en: { title: 'Max Particle Speed', body: 'Limits the maximum speed of particle movement, preventing them from "flying out" due to excessively large forces.' }
    },
    'adv_max_neighbors': {
        ru: { title: 'Макс. Соседей для Отталкивания', body: 'Ограничивает количество соседних частиц, проверяемых для расчета отталкивания. Уменьшение этого значения может повысить производительность, но снизит качество симуляции отталкивания.' },
        en: { title: 'Max Repulsion Neighbors', body: 'Limits the number of neighboring particles checked for calculating repulsion. Decreasing this value can improve performance but will reduce the quality of the repulsion simulation.' }
    },
    'adv_base_amp': {
        ru: { title: 'Базовая Амплитуда', body: 'Основной множитель для силы возбуждения пластины. Увеличение этого параметра делает колебания более сильными, что приводит к более быстрому формированию узоров.' },
        en: { title: 'Base Amplitude', body: 'The main multiplier for the plate excitation force. Increasing this parameter makes the vibrations stronger, leading to faster pattern formation.' }
    },
    'adv_low_cutoff': {
        ru: { title: 'Нижний Порог Частоты', body: 'Частота, ниже которой амплитуда возбуждения будет максимальной. Используется для усиления низких частот.' },
        en: { title: 'Low Frequency Cutoff', body: 'The frequency below which the excitation amplitude will be at its maximum. Used to boost low frequencies.' }
    },
    'adv_high_cutoff': {
        ru: { title: 'Верхний Порог Частоты', body: 'Частота, выше которой амплитуда возбуждения будет минимальной. Используется для ослабления очень высоких частот и стабилизации симуляции.' },
        en: { title: 'High Frequency Cutoff', body: 'The frequency above which the excitation amplitude will be at its minimum. Used to attenuate very high frequencies and stabilize the simulation.' }
    },
    'adv_max_factor': {
        ru: { title: 'Макс. Множитель Амплитуды', body: 'Множитель, применяемый к базовой амплитуде на частотах ниже нижнего порога. Позволяет усилить отклик на низких частотах.' },
        en: { title: 'Max. Amplitude Factor', body: 'The multiplier applied to the base amplitude for frequencies below the low cutoff. Allows for boosting the response at low frequencies.' }
    },
    'adv_min_factor': {
        ru: { title: 'Мин. Множитель Амплитуды', body: 'Множитель, применяемый к базовой амплитуде на частотах выше верхнего порога. Позволяет ослабить отклик на высоких частотах.' },
        en: { title: 'Min. Amplitude Factor', body: 'The multiplier applied to the base amplitude for frequencies above the high cutoff. Allows for attenuating the response at high frequencies.' }
    },
    'adv_deform_scale': {
        ru: { title: 'Масштаб "Прыжка"', body: 'Визуальный множитель, который управляет тем, насколько высоко "подпрыгивают" частицы над вибрирующими участками. Не влияет на физику, только на визуализацию.' },
        en: { title: 'Jump" Scale', body: 'A visual multiplier that controls how high the particles "jump" over the vibrating areas. Does not affect the physics, only the visualization.' }
    },
    'adv_max_amp': {
        ru: { title: 'Макс. "Прыжок"', body: 'Ограничивает максимальную высоту "прыжка" частиц. Предотвращает чрезмерно большие визуальные смещения, которые могут выглядеть неестественно.' },
        en: { title: 'Max. "Jump"', body: 'Limits the maximum height of the particle "jump". Prevents excessively large visual displacements that can look unnatural.' }
    }
};

const PROJECT_PROMPT_TEXT = '';

const DEBUG_MODE = false;

const PLATE_RADIUS_DEFAULT = 7.5;
const PLATE_THICKNESS_DEFAULT = 0.002;
const PLATE_DENSITY_DEFAULT = 7850;
const E_MODULUS_DEFAULT = 200e9;
const POISSON_RATIO_DEFAULT = 0.3;
const PARTICLE_COUNT_DEFAULT = 150000;
const PARTICLE_FORCE_BASE_DEFAULT = 1.5e6;
const PARTICLE_DAMPING_BASE_DEFAULT = 0.95; 
const PARTICLE_RESTITUTION_DEFAULT = 0.5;
const MAX_PARTICLE_SPEED_DEFAULT = 18.0;
const PARTICLE_SIZE_DEFAULT = 2.0; 
const ENABLE_REPULSION_DEFAULT = false;
const REPULSION_RADIUS_DEFAULT = 0.15;
const REPULSION_STRENGTH_DEFAULT = 0.005;
const MAX_REPULSION_NEIGHBORS_DEFAULT = 50;
const MIN_GRID_SIZE_DEFAULT = 33;
const MAX_GRID_SIZE_DEFAULT = 251;
const FDM_STABILITY_FACTOR_DEFAULT = 0.08; 
const FDM_DAMPING_FACTOR_DEFAULT = 0.000050;
const BASE_FDM_STEPS_CPU_DEFAULT = 15;
const MAX_VISUAL_AMPLITUDE_DEFAULT = 0.3;
const VISUAL_DEFORMATION_SCALE_DEFAULT = 50.0;
const EXC_BASE_AMP_DEFAULT = 2.0e4;
const EXC_LOW_CUTOFF_DEFAULT = 100;
const EXC_HIGH_CUTOFF_DEFAULT = 3000;
const EXC_MAX_FACTOR_DEFAULT = 3.0;
const EXC_MIN_FACTOR_DEFAULT = 0.5;

const ENABLE_FDM_OPTIMIZATION_DEFAULT = true;
const ENABLE_SHADOWS_DEFAULT = false;
const ENABLE_DYNAMIC_PARTICLE_DENSITY_DEFAULT = false;
const MIN_DYNAMIC_PARTICLE_COUNT = 2000;
const PARTICLE_COUNT_UPDATE_THROTTLE_MS = 750;
const ENABLE_STUCK_PARTICLE_CULLING_DEFAULT = false;
const STATIONARY_VELOCITY_THRESHOLD = 0.01;
const STUCK_PARTICLE_DISPLACEMENT_THRESHOLD_FACTOR = 0.05;
const ENABLE_SUBTITLES_DEFAULT = true;

const PITCH_MIN_FREQUENCY_HZ = 30;
const PITCH_MAX_FREQUENCY_HZ = 20000; 
const PITCH_UPDATE_INTERVAL_SECONDS = 0.03; 
const PITCH_CHANGE_THRESHOLD_HZ = 8.9;
const PITCH_SMOOTHING_FACTOR = 0.15;

const BPM_PEAK_DETECTION_WINDOW_DEFAULT = 10;
const MAX_AUDIO_DURATION_FOR_MULTIBAND_S = 1800;
const BPM_LOW_BAND_WEIGHT = 3.0;
const BPM_MID_BAND_WEIGHT = 1.5;
const BPM_HIGH_BAND_WEIGHT = 1.2;

const NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_TO_MIDI_NUMBER_OFFSET = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };

class ShaderLoader {
    async load(shaderPaths) {
        const shaderSources = {};
        const promises = Object.entries(shaderPaths).map(async ([key, path]) => {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load shader: ${path}`);
            }
            shaderSources[key] = await response.text();
        });
        await Promise.all(promises);
        return shaderSources;
    }
}

class ChladniSimulator {
    constructor(besselRootsTable, shaderSources) {
        this.besselRootsTable = besselRootsTable;
        this.shaderSources = shaderSources;

        this.PLATE_RADIUS = PLATE_RADIUS_DEFAULT;
        this.PLATE_THICKNESS = PLATE_THICKNESS_DEFAULT;
        this.PLATE_DENSITY = PLATE_DENSITY_DEFAULT;
        this.E_MODULUS = E_MODULUS_DEFAULT;
        this.POISSON_RATIO = POISSON_RATIO_DEFAULT;
        this.D_FLEXURAL_RIGIDITY = 0;
        this.RHO_H_PLATE_SPECIFIC_DENSITY = 0;
        this.PARTICLE_COUNT = PARTICLE_COUNT_DEFAULT;
        this.MAX_PARTICLE_COUNT_USER_SETTING = PARTICLE_COUNT_DEFAULT;
        this.PARTICLE_EFFECTIVE_FORCE_MULTIPLIER_BASE = PARTICLE_FORCE_BASE_DEFAULT;
        this.PARTICLE_DAMPING_BASE = PARTICLE_DAMPING_BASE_DEFAULT;
        this.PARTICLE_BOUNDARY_RESTITUTION = PARTICLE_RESTITUTION_DEFAULT;
        this.MAX_PARTICLE_SPEED = MAX_PARTICLE_SPEED_DEFAULT;
        this.PARTICLE_SIZE = PARTICLE_SIZE_DEFAULT;
        this.ENABLE_PARTICLE_REPULSION = ENABLE_REPULSION_DEFAULT;
        this.PARTICLE_REPULSION_RADIUS = REPULSION_RADIUS_DEFAULT;
        this.PARTICLE_REPULSION_STRENGTH = REPULSION_STRENGTH_DEFAULT;
        this.MAX_REPULSION_NEIGHBORS_CHECK = MAX_REPULSION_NEIGHBORS_DEFAULT;
        this.currentGridSize = MIN_GRID_SIZE_DEFAULT;
        this.MIN_GRID_SIZE = MIN_GRID_SIZE_DEFAULT;
        this.MAX_GRID_SIZE = MAX_GRID_SIZE_DEFAULT;
        this.FDM_STABILITY_FACTOR = FDM_STABILITY_FACTOR_DEFAULT;
        this.FDM_DAMPING_FACTOR = FDM_DAMPING_FACTOR_DEFAULT;
        this.BASE_MAX_FDM_STEPS_PER_FRAME = BASE_FDM_STEPS_CPU_DEFAULT;
        this.enableFDMOptimization = ENABLE_FDM_OPTIMIZATION_DEFAULT;
        this.enableShadows = ENABLE_SHADOWS_DEFAULT;
        this.enableDynamicParticleDensity = ENABLE_DYNAMIC_PARTICLE_DENSITY_DEFAULT;
        this.enableStuckParticleCulling = ENABLE_STUCK_PARTICLE_CULLING_DEFAULT;
        this.isSubtitlesEnabled = ENABLE_SUBTITLES_DEFAULT;
        this.lastParticleCountUpdateTime = 0;
        this.fdmConfiguredFrequency = 0;
        this.MAX_VISUAL_AMPLITUDE = MAX_VISUAL_AMPLITUDE_DEFAULT;
        this.VISUAL_DEFORMATION_SCALE = VISUAL_DEFORMATION_SCALE_DEFAULT;
        this.EXCITATION_FREQ_DEP_BASE_AMP = EXC_BASE_AMP_DEFAULT;
        this.EXCITATION_FREQ_DEP_LOW_CUTOFF = EXC_LOW_CUTOFF_DEFAULT;
        this.EXCITATION_FREQ_DEP_HIGH_CUTOFF = EXC_HIGH_CUTOFF_DEFAULT;
        this.EXCITATION_FREQ_DEP_MAX_FACTOR = EXC_MAX_FACTOR_DEFAULT;
        this.EXCITATION_FREQ_DEP_MIN_FACTOR = EXC_MIN_FACTOR_DEFAULT;
        this.normalExcBaseAmp = EXC_BASE_AMP_DEFAULT;
        this.plateRotationAngle = 0;
        this.plateRotationSpeed = 0;
        this.currentFrequency = 273;
        this.actualAppliedFrequency = 273;
        this.mParameter = 0;
        this.nParameter = 1;
        this.particleSimulationSpeedScale = 1.0;
        this.simulationTime = 0;
        this.areParticlesFrozen = false;
        this.drivingMechanism = 'modal';
        this.isLoadingTrack = false;
        this.activeFetchID = 0;
        this.scene = null; this.camera = null; this.renderer = null;
        this.orbitControls = null; this.animationClock = new THREE.Clock();
        this.dirLight1 = null; this.dirLight2 = null;
        this.mainAudioContext = null; this.generatedSoundOscillator = null; this.generatedSoundGainNode = null;
        this.isGeneratedSoundEnabled = false;
        this.playlistFiles = [];
        this.currentPlaylistIndex = -1;
        this.audioElement = null;
        this.audioFileSourceNode = null;
        this.audioFileBuffer = null;
        this.isAudioFilePlaying = false;
        this.isAudioFilePaused = false;
        this.audioFileDuration = 0;
        this.audioPlaybackOffset = 0;
        this.audioFileCurrentTime = 0;
        this.subtitleContainer = null;
        this.currentSubtitles = [];
        this.pitchDetectorAnalyserNode = null;
        this.pitchDetectorSignalBuffer = null;
        this.MIN_SAMPLES_FOR_PITCH_DETECTION = 0;
        this.MAX_SAMPLES_FOR_PITCH_DETECTION = 0;
        this.lastPitchUpdateTime = 0;
        this.lastStablePitchFrequency = 0;
        this.smoothedPitchFrequency = 273;
        this.isMicrophoneEnabled = false;
        this.microphoneStream = null;
        this.microphoneSourceNode = null;
        this.isDesktopAudioEnabled = false;
        this.desktopStream = null;
        this.desktopAudioSourceNode = null;
        this.bpmAnalyzers = {
            low: { analyser: null, history: [], previousData: null, threshold: 100 },
            mid: { analyser: null, history: [], previousData: null, threshold: 100 },
            high: { analyser: null, history: [], previousData: null, threshold: 100 }
        };
        this.bandSources = null;
        this.allDetectedBeats = [];
        this.currentBPM = 120;
        this.bpmUpdateIntervalId = null;
        this.BPM_PEAK_DETECTION_WINDOW = BPM_PEAK_DETECTION_WINDOW_DEFAULT;
        this.fftAnalyserNode = null; this.frequencyData = null;
        this.currentPianoOctave = 4; this.activePianoKeys = new Set(); this.keyboardPressedKeys = new Set();
        this.keyToNoteMapping = {
            'KeyA': 'C', 'KeyS': 'D', 'KeyD': 'E', 'KeyF': 'F',
            'KeyG': 'G', 'KeyH': 'A', 'KeyJ': 'B', 'KeyK': 'C5',
            'KeyW': 'C#', 'KeyE': 'D#', 'KeyT': 'F#', 'KeyY': 'G#', 'KeyU': 'A#'
        };
        this.uiElements = {}; this.defaultAdvancedSettings = {}; this.besselZerosCache = {};
        this.currentLanguage = 'ru';
        this.tooltipTimeout = null;

        this.gpgpu = {
            scene: new THREE.Scene(),
            camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
            mesh: new THREE.Mesh(new THREE.PlaneGeometry(2, 2)),
            fdm: {},
            particles: {}
        };
        
        this._mainInitialization();
    }
    
    _mainInitialization() {
        this._mapUIElements();
        
        if (!this._checkWebGL2Support()) {
            this._showError("Ошибка: WebGL 2 не поддерживается. Эта версия симулятора требует WebGL 2 для вычислений на GPU.");
            return;
        }
        
        this._setupUX();
        this._storeDefaultSimulationSettings();
        this._setupSubtitleSystem();
        this.MAX_PARTICLE_COUNT_USER_SETTING = PARTICLE_COUNT_DEFAULT;
        this.PARTICLE_COUNT = this.MAX_PARTICLE_COUNT_USER_SETTING;
        this.fdmConfiguredFrequency = this.actualAppliedFrequency;
        this.BPM_PEAK_DETECTION_WINDOW = BPM_PEAK_DETECTION_WINDOW_DEFAULT;
        this.smoothedPitchFrequency = this.currentFrequency;
        this.activeFetchID = 0;
        this.normalExcBaseAmp = this.EXCITATION_FREQ_DEP_BASE_AMP;
        this.besselZerosCache = {};
        
        this._setupThreeJSScene();
        this._setupWebAudioSystem();
        this._createGPGPUInfrastructure();
        this._createParticleSystemGPU();
        this._createPianoKeys();
        this._setupEventListeners();
        this._populateAdvancedControlsUI();
        this._resetAllSettingsToDefaults(false);

        const gpuWarning = document.createElement('p'); 
        gpuWarning.textContent = 'Симуляция на GPU (WebGL 2)'; 
        gpuWarning.style.color = '#98c379'; 
        gpuWarning.style.fontSize = '12px'; 
        gpuWarning.style.textAlign = 'center'; 
        gpuWarning.style.margin = '5px 0'; 
        gpuWarning.style.padding = '3px'; 
        gpuWarning.style.border = '1px solid #98c379'; 
        if (this.uiElements.controls) { 
            const fs = this.uiElements.controls.querySelector('fieldset'); 
            if (fs) this.uiElements.controls.insertBefore(gpuWarning, fs); 
            else this.uiElements.controls.appendChild(gpuWarning); 
        }

        this.animationClock.start();
        this._animateScene();
    }
    
    _handleWindowResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    _animateScene() {
        requestAnimationFrame(this._animateScene.bind(this));
        const deltaTime = Math.min(this.animationClock.getDelta(), 0.05);

        if (this.isSubtitlesEnabled) this._updateSubtitles();
        if (this.orbitControls) this.orbitControls.update();
        
        if (this.plateRotationSpeed !== 0) {
            this.plateRotationAngle = (this.plateRotationAngle + this.plateRotationSpeed * 2 * Math.PI * deltaTime);
            if (this.plateRotationAngle > 2 * Math.PI) this.plateRotationAngle -= 2 * Math.PI;
            if (this.plateRotationAngle < 0) this.plateRotationAngle += 2 * Math.PI;
        }

        this._updateAudioAndFrequency(deltaTime);
        
        if (!this.areParticlesFrozen) {
            this._runGPUSimulationStep(deltaTime);
        }

        this._updateUniformsForFinalRender();
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
    }
    
    _updateAudioAndFrequency(deltaTime) {
        const isLiveAudio = (this.drivingMechanism === 'audio' && this.isAudioFilePlaying && !this.isAudioFilePaused) ||
                            (this.drivingMechanism === 'microphone' && this.isMicrophoneEnabled) ||
                            (this.drivingMechanism === 'desktop_audio' && this.isDesktopAudioEnabled);

        if (isLiveAudio && this.pitchDetectorAnalyserNode && this.mainAudioContext?.state === 'running') {
            const acTime = this.mainAudioContext.currentTime;
            if (acTime - this.lastPitchUpdateTime > PITCH_UPDATE_INTERVAL_SECONDS) {
                this.lastPitchUpdateTime = acTime;
                this.pitchDetectorAnalyserNode.getFloatTimeDomainData(this.pitchDetectorSignalBuffer);
                const detectedFreq = this._autoCorrelatePitch(this.pitchDetectorSignalBuffer, this.mainAudioContext.sampleRate);
                
                if (detectedFreq !== -1) {
                    if (this.lastStablePitchFrequency === 0) this.lastStablePitchFrequency = detectedFreq;
                    this.lastStablePitchFrequency = this._linearInterpolate(this.lastStablePitchFrequency, detectedFreq, 0.3);
                    this.currentFrequency = detectedFreq;
                    
                    if (this.uiElements.pitchDetectorInfo) {
                        this.uiElements.pitchDetectorInfo.style.display = 'block';
                        this.uiElements.pitch.innerText = Math.round(detectedFreq);
                        let midi = this._midiNoteNumberFromFrequency(detectedFreq);
                        this.uiElements.note.innerText = NOTE_NAMES_SHARP[midi % 12];
                        let cents = this._centsOffFromTruePitch(detectedFreq, midi);
                        this.uiElements.detune_amt.innerText = Math.abs(cents);
                        this.uiElements.detune.className = cents === 0 ? "" : (cents < 0 ? "flat" : "sharp");
                    }
                    
                    this.smoothedPitchFrequency = this._linearInterpolate(this.smoothedPitchFrequency, detectedFreq, PITCH_SMOOTHING_FACTOR);
                    
                    if (Math.abs(this.fdmConfiguredFrequency - this.smoothedPitchFrequency) > PITCH_CHANGE_THRESHOLD_HZ) {
                        this.actualAppliedFrequency = this.smoothedPitchFrequency;
                        this._resetFullSimulationState(true); 
                    } else {
                        this.actualAppliedFrequency = this.smoothedPitchFrequency;
                    }
                    this._updateFrequencyControlsUI();
                }
            }
        }
        
        if (this.isAudioFilePlaying || this.isAudioFilePaused || this.audioElement?.controls) {
            this._updateAudioFileProgressControlsUI();
        }
    }

    _runGPUSimulationStep(deltaTime) {
        const scaledDT = deltaTime * this.particleSimulationSpeedScale;
        let numSteps = Math.ceil(scaledDT / this.gpgpu.fdm.dt_simulation_step);
        numSteps = Math.min(numSteps, this.BASE_MAX_FDM_STEPS_PER_FRAME) || 1;
        
        this.renderer.setRenderTarget(this.gpgpu.fdm.stateB);
        this.gpgpu.mesh.material = this.gpgpu.fdm.updateMaterial;

        for (let i = 0; i < numSteps; i++) {
            this.simulationTime += this.gpgpu.fdm.dt_simulation_step;
            this.gpgpu.fdm.updateMaterial.uniforms.u_simulationTime.value = this.simulationTime;
            this.gpgpu.fdm.updateMaterial.uniforms.u_prevState.value = this.gpgpu.fdm.stateA.texture;
            this.renderer.render(this.gpgpu.scene, this.gpgpu.camera);
            [this.gpgpu.fdm.stateA, this.gpgpu.fdm.stateB] = [this.gpgpu.fdm.stateB, this.gpgpu.fdm.stateA];
        }

        this.renderer.setRenderTarget(this.gpgpu.particles.velB);
        this.renderer.setRenderTarget(this.gpgpu.particles.posB);
        
        const particleDrawBuffers = this.renderer.properties.get(this.gpgpu.particles.updateMaterial).drawBuffers;
        if(particleDrawBuffers) {
           this.renderer.setRenderTarget(this.gpgpu.particles.multiTarget);
        } else {
           console.error("MRT not supported");
           return;
        }

        this.gpgpu.mesh.material = this.gpgpu.particles.updateMaterial;
        this.gpgpu.particles.updateMaterial.uniforms.u_particlePosPrev.value = this.gpgpu.particles.posA.texture;
        this.gpgpu.particles.updateMaterial.uniforms.u_particleVelPrev.value = this.gpgpu.particles.velA.texture;
        this.gpgpu.particles.updateMaterial.uniforms.u_plateState.value = this.gpgpu.fdm.stateA.texture;
        this.gpgpu.particles.updateMaterial.uniforms.u_deltaTime.value = scaledDT;
        
        this.renderer.render(this.gpgpu.scene, this.gpgpu.camera);
        
        [this.gpgpu.particles.posA, this.gpgpu.particles.posB] = [this.gpgpu.particles.posB, this.gpgpu.particles.posA];
        [this.gpgpu.particles.velA, this.gpgpu.particles.velB] = [this.gpgpu.particles.velB, this.gpgpu.particles.velA];
    }
    
    _updateUniformsForFinalRender() {
        const mat = this.gpgpu.particles.renderMaterial;
        mat.uniforms.u_particlePositions.value = this.gpgpu.particles.posA.texture;
        mat.uniforms.u_plateState.value = this.gpgpu.fdm.stateA.texture;
        mat.uniforms.u_particleColor.value.setHSL(this._getFrequencyHue(), 0.98, 0.58);
    }
    
    _getFrequencyHue() {
        const freq = this.actualAppliedFrequency || this.currentFrequency;
        if (!freq || freq <= 0 || !isFinite(freq)) return 0;
        const minLog = Math.log10(20);
        const maxLog = Math.log10(20000);
        const currLog = Math.log10(Math.max(20, freq));
        return THREE.MathUtils.clamp((currLog - minLog) / (maxLog - minLog + 1e-9), 0, 1) * 0.7;
    }

    _resetFullSimulationState(keepParticlePositions = false) {
        this._setupPlateParametersForCurrentMode();
        this._updatePhysicalConstants();
        this._initializeFDM_GPU_State();
        this._updateGPUMaterialUniforms();

        if (!keepParticlePositions) {
            this._createParticleSystemGPU();
        }
    }
    
    _updateGPUMaterialUniforms() {
        const fdmUniforms = this.gpgpu.fdm.updateMaterial.uniforms;
        this._updatePhysicalConstants();
        const freqFactor = Math.max(1.0, this.actualAppliedFrequency / 1000.0);
        this.gpgpu.fdm.dx = (this.PLATE_RADIUS * 2.0) / (this.currentGridSize - 1);
        this.gpgpu.fdm.dt_simulation_step = (this.FDM_STABILITY_FACTOR * Math.pow(this.gpgpu.fdm.dx, 2) * Math.sqrt(this.RHO_H_PLATE_SPECIFIC_DENSITY / this.D_FLEXURAL_RIGIDITY)) / freqFactor;
        
        fdmUniforms.u_dt_simulation_step.value = this.gpgpu.fdm.dt_simulation_step;
        fdmUniforms.u_dx.value = this.gpgpu.fdm.dx;
        fdmUniforms.u_K_coeff.value = (this.gpgpu.fdm.dt_simulation_step ** 2 * this.D_FLEXURAL_RIGIDITY) / this.RHO_H_PLATE_SPECIFIC_DENSITY;
        fdmUniforms.u_F_coeff.value = (this.gpgpu.fdm.dt_simulation_step ** 2) / this.RHO_H_PLATE_SPECIFIC_DENSITY;
        const freqDampingCoefficient = 0.05;
        const baseDamping = this.FDM_DAMPING_FACTOR;
        const extraDamping = baseDamping * freqDampingCoefficient * Math.min(5.0, Math.max(0, (this.actualAppliedFrequency / 1000.0) - 1.0));
        fdmUniforms.u_damping.value = baseDamping + extraDamping;
        fdmUniforms.u_exc_amp.value = this._getFrequencyDependentExcitationAmplitude(this.actualAppliedFrequency);
        fdmUniforms.u_frequency.value = this.actualAppliedFrequency;
        fdmUniforms.u_resolution.value.set(this.currentGridSize, this.currentGridSize);
        fdmUniforms.u_exc_mode.value = this.drivingMechanism === 'modal' ? 0 : 1;
        fdmUniforms.u_modalExcitationPattern.value = this.gpgpu.fdm.modalPatternTexture;
        fdmUniforms.u_m_param.value = parseFloat(this.mParameter);
        
        const particleUniforms = this.gpgpu.particles.updateMaterial.uniforms;
        particleUniforms.u_forceMultiplier.value = this.PARTICLE_EFFECTIVE_FORCE_MULTIPLIER_BASE;
        particleUniforms.u_dampingBase.value = this.PARTICLE_DAMPING_BASE;
        particleUniforms.u_plateRadius.value = this.PLATE_RADIUS;
        particleUniforms.u_maxParticleSpeed.value = this.MAX_PARTICLE_SPEED;
        particleUniforms.u_restitution.value = this.PARTICLE_BOUNDARY_RESTITUTION;
        particleUniforms.u_gridSize.value = this.currentGridSize;

        const renderUniforms = this.gpgpu.particles.renderMaterial.uniforms;
        renderUniforms.u_plateRadius.value = this.PLATE_RADIUS;
        renderUniforms.u_particleSize.value = this.PARTICLE_SIZE;
        renderUniforms.u_visualDeformationScale.value = this.VISUAL_DEFORMATION_SCALE;
        renderUniforms.u_maxVisualAmplitude.value = this.MAX_VISUAL_AMPLITUDE;
    }
}

async function main() {
    try {
        const shaderPaths = {
            common_vertex: './shaders/common_vertex.glsl',
            fdm_update_frag: './shaders/fdm_update_frag.glsl',
            particle_update_frag: './shaders/particle_update_frag.glsl',
            particle_render_vert: './shaders/particle_render_vert.glsl',
            particle_render_frag: './shaders/particle_render_frag.glsl',
        };
        
        const shaderLoader = new ShaderLoader();
        const [besselRootsData, shaderSources] = await Promise.all([
            fetch('./data/bessel_roots.json').then(res => {
                if (!res.ok) throw new Error(`Failed to load bessel_roots.json: ${res.status} ${res.statusText}`);
                return res.json();
            }),
            shaderLoader.load(shaderPaths)
        ]);

        new ChladniSimulator(besselRootsData, shaderSources);

    } catch (error) {
        console.error("Critical simulation initialization error:", error);
        document.body.innerHTML = `<div style="color: #e06c75; background-color:#282c34; padding: 20px; font-family: sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center;">
            <div>
                <h1>Критическая ошибка</h1>
                <p>Не удалось загрузить необходимые данные для симуляции.<br>
                   Убедитесь, что все файлы проекта, включая шейдеры в папке /shaders/ и данные в /data/, существуют и доступны.</p>
                <p style="font-family: monospace; background-color: #21252b; padding: 10px; border-radius: 5px;">${error.message}</p>
            </div>
        </div>`;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
