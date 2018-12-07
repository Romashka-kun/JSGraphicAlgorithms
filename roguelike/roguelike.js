function init() {

    let stage = new createjs.Stage('game');
    let canvas = document.getElementById('game');

    const ARENA_H = 48;
    const ARENA_W = 64;

    const MOVE_LEFT = 'KeyA';
    const MOVE_RIGHT = 'KeyD';
    const MOVE_UP = 'KeyW';
    const MOVE_DOWN = 'KeyS';

    //****************************Создание уровня************************************

    let arena = new createjs.Container();

    let floor = new createjs.Shape();
    floor.graphics
        .beginFill('beige')
        .drawRect(0, 0, ARENA_W * 10, ARENA_H * 10);

    const wallThickness = 10;

    let levelGrid = twoDimArray(ARENA_W, ARENA_H);

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
            .drawRect(0, 0, wallThickness, wallThickness);
        wallCell.x = i * wallThickness;
        wallCell.y = j * wallThickness;

        return wallCell;
    }

    for (let i = 0; i < ARENA_W; i++) {
        for (let j = 0; j < ARENA_H; j++) {
            if (i === 0 || i === ARENA_W - 1 || j === 0 || j === ARENA_H - 1
                || (i === ARENA_W / 4 || i === 3 * ARENA_W / 4) && j > ARENA_H / 4 && j < 3 * ARENA_H / 4) {
                arena.addChild(buildAWall(i, j));
                levelGrid[i][j] = 1;
            } else
                levelGrid[i][j] = 0;
        }
    }

    //******************Создание персонажа***************************************************************

    let charBody = new createjs.Shape();
    charBody.graphics
        .beginFill('green')
        .drawRect(0, 0, 20, 20);

    let charGun = new createjs.Shape();
    charGun.graphics
        .beginFill('black')
        .drawRect(13, 2, 7, -15);

    let mainChar = new createjs.Container();
    mainChar.addChild(charGun, charBody);
    mainChar.setTransform(ARENA_W * 5, ARENA_H * 5, 1, 1, 0, 0, 0, 10, 10);
    const mainCharIntersectParam = 10;

    stage.addChild(floor, arena, mainChar);

    //******************Управление персонажем**********************************************************

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

    let prevPosition = [0, 0];

    createjs.Ticker.addEventListener('tick', function () {

        if (isIntersect(mainChar, mainCharIntersectParam)) {
            mainChar.x = prevPosition[0];
            mainChar.y = prevPosition[1];
            return;
        }

        prevPosition[0] = mainChar.x;
        prevPosition[1] = mainChar.y;

        if (map[MOVE_UP] && map[MOVE_LEFT]) {
            mainChar.x -= 5;
            mainChar.y -= 5;
        } else if (map[MOVE_UP] && map[MOVE_RIGHT]) {
            mainChar.x += 5;
            mainChar.y -= 5;
        } else if (map[MOVE_DOWN] && map[MOVE_LEFT]) {
            mainChar.x -= 5;
            mainChar.y += 5;
        } else if (map[MOVE_DOWN] && map[MOVE_RIGHT]) {
            mainChar.x += 5;
            mainChar.y += 5;
        } else if (map[MOVE_DOWN])
            mainChar.y += 5;
        else if (map[MOVE_UP])
            mainChar.y -= 5;
        else if (map[MOVE_LEFT])
            mainChar.x -= 5;
        else if (map[MOVE_RIGHT])
            mainChar.x += 5;
    });


    stage.addEventListener('stagemousemove', function (e) {
        mainChar.rotation = Math.atan2(e.localX - mainChar.x, -(e.localY - mainChar.y)) * (180 / Math.PI);
    });

    stage.addEventListener('click', function (e) {
        mainChar.rotation = Math.atan2(e.localX - mainChar.x, -(e.localY - mainChar.y)) * (180 / Math.PI);
    });

    //**************************Пересечение объектов**********************************

    function isIntersect(shape, param) {
        for (let i = 0; i < arena.numChildren; i++) {
            let wall = arena.getChildAt(i);
            if (Math.max(shape.x - param, wall.x) < Math.min(shape.x + param, wall.x + wallThickness) &&
                Math.max(shape.y - param, wall.y) < Math.min(shape.y + param, wall.y + wallThickness))
                return true;
        }
        return false;
    }

    //****************************Стрельба********************************************

    const bulletSpeed = 5;
    const bulletRadius = 2;
    const bulletIntersectParam = 0.1;

    function fireBullet(dx, dy) {
        let bullet = new createjs.Shape();
        bullet.graphics
            .beginFill('red')
            .drawCircle(0, 0, bulletRadius);
        bullet.x = mainChar.x;
        bullet.y = mainChar.y;

        stage.addChild(bullet);
        bullet.addEventListener('tick', function () {
            bulletTick(bullet, dx, dy);
        });
    }

    function bulletTick(bullet, dx, dy) {
        let distance = Math.sqrt(dx * dx + dy * dy);
        bullet.x += dx / distance * bulletSpeed;
        bullet.y += dy / distance * bulletSpeed;
        if (isIntersect(bullet, bulletIntersectParam))
            stage.removeChild(bullet);
        if (outsideOfCanvas(bullet))
            stage.removeChild(bullet);
    }

    stage.addEventListener('click', function (e) {
        fireBullet(e.localX - mainChar.x, e.localY - mainChar.y);
    });

    function outsideOfCanvas(shape) {
        if (shape.x > canvas.width || shape.x < 0 || shape.y > canvas.height || shape.y < 0)
            stage.removeChild(shape);
    }

    //*********************************Поиск кратчайшего пути***************************************
    // console.log(pathFinding(10, 15, Math.round(mainChar.x / 10), Math.round(mainChar.y / 10)));

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

                //[[-1, 0], [1, 0], [0, -1], [0, 1]]

                if (levelGrid[currentElX + 1][currentElY] === 0 &&
                    shPath[currentElX + 1][currentElY] === -1) {

                    shPath[currentElX + 1][currentElY] = value + 1;
                    cells_with_next_value.push([currentElX + 1, currentElY]);
                }
                if (levelGrid[currentElX - 1][currentElY] === 0 &&
                    shPath[currentElX - 1][currentElY] === -1) {

                    shPath[currentElX - 1][currentElY] = value + 1;
                    cells_with_next_value.push([currentElX - 1, currentElY]);
                }
                if (levelGrid[currentElX][currentElY + 1] === 0 &&
                    shPath[currentElX][currentElY + 1] === -1) {

                    shPath[currentElX][currentElY + 1] = value + 1;
                    cells_with_next_value.push([currentElX, currentElY + 1]);
                }
                if (levelGrid[currentElX][currentElY - 1] === 0 &&
                    shPath[currentElX][currentElY - 1] === -1) {

                    shPath[currentElX][currentElY - 1] = value + 1;
                    cells_with_next_value.push([currentElX, currentElY - 1]);
                }
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

            if (shPath[currentElX + 1][currentElY] === routeLength - 1 - i) {
                route.push([currentElX + 1, currentElY]);
                currentElX++;
            } else if (shPath[currentElX - 1][currentElY] === routeLength - 1 - i) {
                route.push([currentElX - 1, currentElY]);
                currentElX--;
            } else if (shPath[currentElX][currentElY + 1] === routeLength - 1 - i) {
                route.push([currentElX, currentElY + 1]);
                currentElY++;
            } else if (shPath[currentElX][currentElY - 1] === routeLength - 1 - i) {
                route.push([currentElX, currentElY - 1]);
                currentElY--;
            }

        }

        // return route[routeLength - 1];
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
        console.log(smoothRoute);
        return smoothRoute[0];
    }

    function walkable(a, b, shPath) {
        let x1 = a[0]/* * 10*/;
        let y1 = a[1]/* * 10*/;
        let x2 = b[0]/* * 10*/;
        let y2 = b[1]/* * 10*/;

        let dx = x2 - x1;
        let dy = y2 - y1;
        let distance = Math.sqrt(dx * dx + dy * dy);

        for (let i = 0; i < distance * 2; i++) {

            let t = 0.5 / distance * i;
            let x = Math.round((x1 + t * (x2 - x1)));
            let y = Math.round((y1 + t * (y2 - y1)));
            // console.log(x + " " + y);
            if (shPath[x][y] === -1)
                return false;

        }
        return true;
    }


    //*******************************ВРАги**************************************************

    let enemyList = new createjs.Container();
    stage.addChild(enemyList);

    let enemy = new createjs.Shape();
    enemy.graphics
        .beginFill('blue')
        .drawRect(0, 0, 10, 10);
    enemy.regX = 5;
    enemy.regY = 5;
    enemy.x = 100;
    enemy.y = 150;
    // enemy.setTransform(100, 150, 1, 1, 0, 0, 0, 5, 5);

    stage.addChild(enemy);

    enemy.addEventListener('tick', function () {

        let enemyX = Math.round(enemy.x / 10);
        let enemyY = Math.round(enemy.y / 10);

        let route = pathFinding(enemyX, enemyY, Math.round(mainChar.x / 10), Math.round(mainChar.y / 10));
        let dx = route[0] - enemyX;
        let dy = route[1] - enemyY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0)
            distance = 1;

        // console.log(enemy.x + " " + enemy.y);
        console.log(enemyX + " " + enemyY + " " + distance);
        enemy.x += dx / distance;
        enemy.y += dy / distance;


    });



    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.timerMode = createjs.Ticker.RAF_SYNCHED;
}