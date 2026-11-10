# ph-hero-paper — фон обложки (генерируется первым, задаёт тон)
Где: фон секции hero, full-bleed, поверх — знак «Тепло» слева и mono-сноска справа сверху.
Размер: desktop 16:9, финал 2560×1440 (десктоп), мобильный — кроп 4:5 из правой части (mobile_focus_x: 0.82).
Безопасная зона: левая половина кадра — тихая светлая бумага под текст.
Два варианта, черновики обоих; выбор пользователя.

## Вариант A — пшеничный батон сбоку (референс image copy 3.png)
Overhead photograph of crumpled brown kraft paper filling the whole frame as a tabletop surface, soft creases and folds catching daylight. A wheat sourdough loaf with a flour-dusted crust enters the frame from the bottom right corner, about a third of the loaf visible, diagonal scoring cuts on the crust. The left half of the frame is quiet flat kraft paper with a light uneven dusting of flour. Shot from directly above with a 35mm lens at f/4; single window light from the upper left, the right side falls into soft shadow. Warm cream and brown palette, matte paper texture, fine flour specks. Main subject within the right quarter, safe for a 4:5 crop of the right side. No text, no watermark, no people, no props, no light rays.

## Вариант B — круглый хлеб четвертью из угла (вид сверху)
Overhead photograph of crumpled brown kraft paper filling the frame as a tabletop. A round wheat sourdough boule seen from directly above occupies only the bottom right corner quarter of the frame: scored petal cuts, blistered flour-dusted crust; the boule is cropped by the frame edges, only its quarter visible. The remaining three quarters are flat crumpled kraft paper with a light dusting of flour. 35mm lens, top-down, f/4; single window light from the upper left, lower right corner slightly darker. Warm cream and brown palette, matte paper texture. Safe for a 4:5 crop of the right side. No text, no watermark, no people, no props, no light rays.

## Итерация 2 (2026-11-09, правка пользователя: «бумага перебивает текст»)
Поменян один параметр — характер бумаги: «very subtle, barely visible soft creases, reads almost like plain matte cardstock, very low contrast, f/8» вместо смятой крафт-бумаги; мука сведена к следу. Черновики `ph-hero-paper-quiet-*` (2 шт) приняты.

## Итерация 3 (2026-11-09, правка пользователя: «хлеб виден только на четверть»)
Финал-композит по точному рецепту пользователя: батон из B-v1 + бумага из quiet-v3-b + тень строго под хлебом (свет сверху). Промпт-инструкция: «its center lies outside the frame beyond the corner; three quarters of the boule lie beyond the frame edges». Черновики `ph-hero-paper-quarter-*` (2 шт), финал `ph-hero-paper-20261109T145606373-2ede.png` (max, 2560×1440). Урок для серии: модель упорно показывает бухонку целиком (~70%) — кроп «четверть из угла» требует явного «its center lies outside the frame».
