function init() {

    let stage = new createjs.Stage('game');
    let canvas = document.getElementById('game');

    const ARENA_H = 48;
    const ARENA_W = 64;

    const MOVE_LEFT = 'KeyA';
    const MOVE_RIGHT = 'KeyD';
    const MOVE_UP = 'KeyW';
    const MOVE_DOWN = 'KeyS';

    let enemySpeed = 2;

    let mainMenu = new createjs.Container();
    let difMenu = new createjs.Container();
    let game = new createjs.Container();

    showMainMenu();

    //*********************************************Main menu************************************************************

    function showMainMenu() {
        let playB = buttonText(5, "PLAY");

        let difficulty = buttonText(6, "DIFFICULTY");

        let startBg = buttonBackground(playB.x, playB.y, playB.getMeasuredWidth(), playB.getMeasuredHeight());
        let difBg = buttonBackground(difficulty.x, difficulty.y,
            difficulty.getMeasuredWidth(), difficulty.getMeasuredHeight());

        mainMenu.addChild(startBg, playB, difBg, difficulty);
        stage.addChild(mainMenu);
        mainMenu.addEventListener("click", function (e) {
            if (e.target === startBg) {
                stage.removeChild(mainMenu);
                stage.addChild(game);
                startGame();
            } else if (e.target === difBg) {
                stage.removeChild(mainMenu);
                stage.addChild(difMenu);
                showDifMenu();
            }
        })
    }

    function showDifMenu() {
        let easy = buttonText(5, "EASY");
        let easyBg = buttonBackground(easy.x, easy.y, easy.getMeasuredWidth(), easy.getMeasuredHeight());

        let medium = buttonText(6, "MEDIUM");
        let mediumBg = buttonBackground(medium.x, medium.y, medium.getMeasuredWidth(), medium.getMeasuredHeight());

        let high =  buttonText(7, "HIGH");
        let highBg = buttonBackground(high.x, high.y, high.getMeasuredWidth(), high.getMeasuredHeight());

        difMenu.addChild(easyBg, easy, mediumBg, medium, highBg, high);

        difMenu.addEventListener("click", function (e) {
            if (e.target === easyBg) {
                enemySpeed = 2;
            } else if (e.target === mediumBg) {
                enemySpeed = 3;
            } else {
                enemySpeed = 5;
            }
            stage.removeChild(difMenu);
            stage.addChild(mainMenu);
        });
    }

    function buttonText(height, text) {
        let button =  new createjs.Text(text, "30px Joystix Monospace", "#ff7700");
        button.x = ARENA_W * 5;
        button.y = ARENA_H * height;
        button.textAlign = "center";
        button.textBaseline = "middle";

        return button;
    }

    function buttonBackground(x, y, width, height) {
        let buttonBg = new createjs.Shape();
        buttonBg.graphics
            .beginFill("grey")
            .drawRect(0, 0, width, height);

        buttonBg.x = x - width / 2;
        buttonBg.y = y - height / 2;

        return buttonBg;
    }

    function startGame() {
        //*******************************************Level creation*********************************************************

        let arena = new createjs.Container();

        let floor = new createjs.Shape();
        floor.graphics
            .beginFill('beige')
            .drawRect(0, 0, ARENA_W * 10, ARENA_H * 10);

        const wallHitBox = 10;

        let levelGrid = twoDimArray(ARENA_W, ARENA_H, 0);

        function twoDimArray(rows, cols, value) {
            let array = new Array(rows);
            for (let i = 0; i < rows; i++) {
                array[i] = new Array(cols);
                for (let j = 0; j < cols; j++)
                    array[i][j] = value;
            }
            return array;
        }

        function buildAWall(i, j) {
            let wallCell = new createjs.Shape();
            wallCell.graphics
                .beginFill('grey')
                .drawRect(0, 0, wallHitBox, wallHitBox);
            wallCell.regX = wallHitBox / 2;
            wallCell.regY = wallHitBox / 2;
            wallCell.x = i * wallHitBox + 5;
            wallCell.y = j * wallHitBox + 5;

            return wallCell;
        }

        for (let i = 0; i < ARENA_W; i++) {
            for (let j = 0; j < ARENA_H; j++) {
                if (i === 0 || i === ARENA_W - 1 || j === 0 || j === ARENA_H - 1
                    || (i === ARENA_W / 4 || i === 3 * ARENA_W / 4) && j > ARENA_H / 4 && j < 3 * ARENA_H / 4) {
                    arena.addChild(buildAWall(i, j));
                    levelGrid[i][j] = 1;
                }
            }
        }

        //*******************************************Hero creation**********************************************************

        let heroHP = 10;
        let hpDisplay = new createjs.Text("HP: " + heroHP, "20px Joystix Monospace", "#ff7700");
        hpDisplay.x = 20;
        hpDisplay.y = 20;
        let heroBody = new createjs.Shape();
        heroBody.graphics
            .beginFill('green')
            .drawRect(0, 0, 20, 20);

        let heroGun = new createjs.Shape();
        heroGun.graphics
            .beginFill('black')
            .drawRect(13, 2, 7, -15);

        let hero = new createjs.Container();
        hero.addChild(heroGun, heroBody);
        hero.setTransform(ARENA_W * 5, ARENA_H * 5, 1, 1, 0, 0, 0, 10, 10);
        const heroHitBox = 10;

        game.addChild(floor, arena, hero, hpDisplay);

        //*******************************************Hero movement**********************************************************

        let map = {};
        map[MOVE_LEFT] = false;
        map[MOVE_RIGHT] = false;
        map[MOVE_DOWN] = false;
        map[MOVE_UP] = false;

        document.addEventListener('keydown', key_up_down_handler);
        document.addEventListener('keyup', key_up_down_handler);

        function key_up_down_handler(e) {
            if (!(e.code in map)) // если в словаре map нет записи с таким ключом
                return;

            map[e.code] = e.type === 'keydown';

            // e.preventDefault();
        }

        createjs.Ticker.addEventListener('tick', function () {

            let new_x = hero.x;
            let new_y = hero.y;

            if (map[MOVE_UP] && map[MOVE_LEFT]) {
                new_x -= 5;
                new_y -= 5;
            } else if (map[MOVE_UP] && map[MOVE_RIGHT]) {
                new_x += 5;
                new_y -= 5;
            } else if (map[MOVE_DOWN] && map[MOVE_LEFT]) {
                new_x -= 5;
                new_y += 5;
            } else if (map[MOVE_DOWN] && map[MOVE_RIGHT]) {
                new_x += 5;
                new_y += 5;
            } else if (map[MOVE_DOWN])
                new_y += 5;
            else if (map[MOVE_UP])
                new_y -= 5;
            else if (map[MOVE_LEFT])
                new_x -= 5;
            else if (map[MOVE_RIGHT]) {
                new_x += 5;
            }

            if (!isIntersectPoint(new_x, new_y, heroHitBox, arena, wallHitBox)) {
                hero.x = new_x;
                hero.y = new_y;
            }
        });


        stage.addEventListener('stagemousemove', function (e) {
            hero.rotation = Math.atan2(e.localX - hero.x, -(e.localY - hero.y)) * (180 / Math.PI);
        });

        game.addEventListener('click', function (e) {
            hero.rotation = Math.atan2(e.localX - hero.x, -(e.localY - hero.y)) * (180 / Math.PI);
        });

        //******************************************Object intersection*****************************************************

        function isIntersect(shape, hitBox, container, obstacleHitBox) {
            return isIntersectPoint(shape.x, shape.y, hitBox, container, obstacleHitBox)
        }

        function isIntersectPoint(x, y, hitBox, container, obstacleHitBox) {
            for (let i = 0; i < container.numChildren; i++) {
                let obstacle = container.getChildAt(i);
                let thick = obstacleHitBox / 2;
                if (Math.max(x - hitBox, obstacle.x - thick) < Math.min(x + hitBox, obstacle.x + thick) &&
                    Math.max(y - hitBox, obstacle.y) - thick < Math.min(y + hitBox, obstacle.y + thick))
                    return true;
            }
            return false;
        }

        function isIntersectBullet(x, y, hitBox, container, obstacleHitBox) {
            for (let i = 0; i < container.numChildren; i++) {
                let obstacle = container.getChildAt(i);
                let thick = obstacleHitBox / 2;
                if (Math.max(x - hitBox, obstacle.x - thick) < Math.min(x + hitBox, obstacle.x + thick) &&
                    Math.max(y - hitBox, obstacle.y) - thick < Math.min(y + hitBox, obstacle.y + thick))
                    return obstacle;
            }
            return -1;
        }

        //**********************************************Shooting************************************************************

        const bulletSpeed = 5;
        const bulletRadius = 2;
        const bulletHitBox = 0.1;

        function fireBullet(dx, dy) {
            let bullet = new createjs.Shape();
            bullet.graphics
                .beginFill('red')
                .drawCircle(0, 0, bulletRadius);
            bullet.x = hero.x;
            bullet.y = hero.y;

            game.addChild(bullet);
            bullet.addEventListener('tick', function () {
                bulletTick(bullet, dx, dy);
            });
        }

        function bulletTick(bullet, dx, dy) {
            let distance = Math.sqrt(dx * dx + dy * dy);
            bullet.x += dx / distance * bulletSpeed;
            bullet.y += dy / distance * bulletSpeed;
            let enemy = isIntersectBullet(bullet.x, bullet.y, bulletHitBox, enemyList, enemyHitBox);
            if (enemy !== -1) {
                enemyList.removeChild(enemy);
                game.removeChild(bullet);
            }
            if (isIntersect(bullet, bulletHitBox, arena, wallHitBox))
                game.removeChild(bullet);
            if (outsideOfCanvas(bullet))
                game.removeChild(bullet);
        }

        game.addEventListener('click', function (e) {
            fireBullet(e.localX - hero.x, e.localY - hero.y);
        });

        function outsideOfCanvas(shape) {
            if (shape.x > canvas.width || shape.x < 0 || shape.y > canvas.height || shape.y < 0)
                game.removeChild(shape);
        }

        //**********************************************Path Finding********************************************************

        function pathFinding(enemyX, enemyY, heroX, heroY) {
            let shPath = twoDimArray(ARENA_W, ARENA_H, -1);
            shPath[enemyX][enemyY] = 0;

            let value = 0;
            let cells_with_value = [[enemyX, enemyY]];

            while (shPath[heroX][heroY] === -1) {
                let cells_with_next_value = [];

                for (let i = 0; i < cells_with_value.length; i++) {
                    let currentElX = cells_with_value[i][0];
                    let currentElY = cells_with_value[i][1];

                    for (let j = 0; j < 4; j++) {

                        let dx = (j % 2) * (j - 2);
                        let dy = ((j + 1) % 2) * (j - 1);

                        if (levelGrid[currentElX + dx][currentElY + dy] === 0 &&
                            shPath[currentElX + dx][currentElY + dy] === -1) {

                            shPath[currentElX + dx][currentElY + dy] = value + 1;
                            cells_with_next_value.push([currentElX + dx, currentElY + dy]);
                        }
                    }
                }

                if (cells_with_next_value.length === 0) {
                    console.log(cells_with_value);
                    return [];
                }

                value++;
                cells_with_value = cells_with_next_value;
            }
            return createRoute(shPath, heroX, heroY);
        }

        function createRoute(shPath, heroX, heroY) {
            let routeLength = shPath[heroX][heroY];
            let currentElX = heroX;
            let currentElY = heroY;
            let route = [[heroX, heroY]];
            for (let i = 0; i < routeLength - 1; i++) {

                for (let j = 0; j < 4; j++) {
                    let dx = (j % 2) * (j - 2);
                    let dy = ((j + 1) % 2) * (j - 1);
                    if (shPath[currentElX + dx][currentElY + dy] === routeLength - 1 - i) {
                        route.push([currentElX + dx, currentElY + dy]);
                        currentElX += dx;
                        currentElY += dy;
                    }
                }

            }

            return pathSmoothing(shPath, route);
        }

        function pathSmoothing(shPath, route) {
            let routeLength = route.length - 1;
            let smoothRoute = [];
            let checkPoint = route[routeLength];
            let currentPoint = route[routeLength - 1];

            for (let i = 0; i < routeLength; i++) {
                // debugger;
                if (walkable(checkPoint, route[routeLength - 1 - i], shPath)) {
                    currentPoint = route[routeLength - 1 - i];
                } else {
                    smoothRoute.push(currentPoint);
                    checkPoint = currentPoint;
                    currentPoint = route[routeLength - 1 - i];
                }
            }
            smoothRoute.push(route[0]);
            return smoothRoute[0];
        }

        function walkable(a, b, shPath) {
            let x1 = a[0];
            let y1 = a[1];
            let x2 = b[0];
            let y2 = b[1];

            let dx = x2 - x1;
            let dy = y2 - y1;
            let distance = Math.sqrt(dx * dx + dy * dy);

            for (let i = 0; i < distance * 2; i++) {

                let t = 0.5 / distance * i;
                let x = Math.round((x1 + t * (x2 - x1)));
                let y = Math.round((y1 + t * (y2 - y1)));
                if (shPath[x][y] === -1)
                    return false;

            }
            return true;
        }


        //***********************************************Enemies************************************************************

        let enemyList = new createjs.Container();
        game.addChild(enemyList);
        let tick = 0;
        let waveNum = 1;
        let enemyHitBox = 10;

        enemyList.addEventListener("tick", createEnemyWave);

        function createEnemyWave() {
            if (enemyList.numChildren === 0) {
                for (let i = 0; i < waveNum; i++) {

                    let enemy = new createjs.Shape();
                    enemy.graphics
                        .beginFill('blue')
                        .drawRect(0, 0, enemyHitBox, enemyHitBox);
                    enemy.regX = enemyHitBox / 2;
                    enemy.regY = enemyHitBox / 2;

                    let position = randomPosition();

                    enemy.x = position[0] * 10;
                    enemy.y = position[1] * 10;

                    enemyList.addChild(enemy);

                    enemy.on("tick", enemyAI);

                }
                waveNum++;
            }
        }

        function randomPosition() {
            let position = 1;
            let hEl;
            let vEl;
            while (position !== 0) {
                hEl = Math.floor(Math.random() * ARENA_W);
                vEl = Math.floor(Math.random() * ARENA_H);
                position = levelGrid[hEl][vEl];
            }
            return [hEl, vEl];
        }

        function enemyAI() {
            let enemyX = Math.round(this.x / 10);
            let enemyY = Math.round(this.y / 10);
            let heroX = Math.round(hero.x / 10);
            let heroY = Math.round(hero.y / 10);
            tick++;

            if (heroHP <= 0) {
                game.removeChild(hero);
                let game_over = new createjs.Text("GAME OVER", "30px Joystix Monospace", "#ff7700");
                game_over.x = ARENA_W * 5;
                game_over.y = ARENA_H * 5;
                game_over.textAlign = "center";
                game_over.textBaseline = "middle";
                game.addChild(game_over);
                this.removeEventListener("tick", enemyAI);
                game.addEventListener("click", returnToMenu);

            } else if (tick >= 40 && enemyX === heroX && enemyY === heroY) {
                tick = 0;
                heroHP--;
                hpDisplay.text = "HP: " + heroHP

            } else {

                let route = pathFinding(enemyX, enemyY, heroX, heroY);
                let dx, dy;
                if (route.length === 0) {
                    dx = 0;
                    dy = 0;
                } else {
                    dx = route[0] - enemyX;
                    dy = route[1] - enemyY;
                }
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance === 0)
                    distance = 1;

                this.x += dx / distance * enemySpeed;
                this.y += dy / distance * enemySpeed;
            }
        }

        function returnToMenu() {
            stage.removeChild(game);
            stage.addChild(mainMenu);
        }
    }



    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.timerMode = createjs.Ticker.RAF_SYNCHED;
}