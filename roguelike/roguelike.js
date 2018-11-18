function init() {

    var stage = new createjs.Stage("game");

    const ARENA_H = 48;
    const ARENA_W = 64;

    const MOVE_LEFT = "KeyA";
    const MOVE_RIGHT = "KeyD";
    const MOVE_UP = "KeyW";
    const MOVE_DOWN = "KeyS";

    //****************************Создание уровня************************************

    var arena = new createjs.Container();

    var floor = new createjs.Shape();
    floor.graphics
        .beginFill("beige")
        .drawRect(0, 0, ARENA_W * 10, ARENA_H * 10);

    const wallThickness = 10;

    var level = new Array(58);

    function buildAWall(i, j) {
        var wallCell = new createjs.Shape();
        wallCell.graphics
            .beginFill("grey")
            // .drawRect(i * wallThickness, j * wallThickness, wallThickness, wallThickness);
            .drawRect(0, 0, wallThickness, wallThickness);
        wallCell.x = i * wallThickness;
        wallCell.y = j * wallThickness;

        return wallCell;
    }

    for (let i = 0; i < ARENA_W; i++) {
        level[i] = new Array(ARENA_H);
        for (let j = 0; j < ARENA_H; j++) {
            if (i === 0 || i === ARENA_W - 1 || j === 0 || j === ARENA_H - 1
                || (i === ARENA_W / 4 || i === 3 * ARENA_W / 4) && j > ARENA_H / 4 && j < 3 * ARENA_H / 4)
                level[i][j] = buildAWall(i, j);

            arena.addChild(level[i][j]);
        }
    }

    //******************Создание персонажа***************************************************************

    var charBody = new createjs.Shape();
    charBody.graphics
        .beginFill('green')
        .drawRect(0, 0, 20, 20);

    var charGun = new createjs.Shape();
    charGun.graphics
        .beginFill('black')
        .drawRect(13, 2, 7, -15);

    var mainChar = new createjs.Container();
    mainChar.addChild(charGun, charBody);
    mainChar.setTransform(ARENA_W * 5, ARENA_H * 5, 1, 1, 0, 0, 0, 10, 10);

    stage.addChild(floor, arena, mainChar);

    //******************Управление персонажем**********************************************************

    var map = {};
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

    var prevPosition = [0, 0];

    createjs.Ticker.addEventListener("tick", function() {

        if (isIntersect(mainChar)) {
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

    //**************************Пересечение стен**********************************

    function isIntersect(shape) {
        for (let i = 0; i < arena.numChildren; i++) {
            let wall = arena.getChildAt(i);
            if (Math.max(shape.x - 10, wall.x) < Math.min(shape.x + 10, wall.x + 10) &&
                Math.max(shape.y - 10, wall.y) < Math.min(shape.y + 10, wall.y + 10))
                return true;
        }
        return false;
    }

    //****************************Стрельба********************************************

    const bulletSpeed = 5;
    const bulletRadius = 2;

    function fireBullet(dx, dy) {
        let bullet = new createjs.Shape();
        bullet.graphics
            .beginFill('red')
            .drawCircle(mainChar.x, mainChar.y, bulletRadius);
        stage.addChild(bullet);
        bullet.addEventListener('tick', function () {
            bulletTick(bullet, dx, dy);
        });
    }

    function bulletTick(bullet, dx, dy) {
        let distance = Math.sqrt(dx * dx + dy * dy);
        bullet.x += dx / distance * bulletSpeed;
        bullet.y += dy / distance * bulletSpeed;
    }

    stage.addEventListener('click', function (e) {
        fireBullet(e.localX - mainChar.x, e.localY - mainChar.y);
    });


    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.timerMode = createjs.Ticker.RAF_SYNCHED;
}