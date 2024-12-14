function setup() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Common = Matter.Common,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Events = Matter.Events,
        Bodies = Matter.Bodies,
        Vector = Matter.Vector,
        Bounds = Matter.Bounds,
        Body = Matter.Body;
  
  
    // create engine
    var engine = Engine.create(),
        world = engine.world;
        engine.world.gravity.y = 0.2; // Disable vertical gravity

  
  
    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: windowWidth,
            height: 2000,
            hasBounds: true,
            wireframes: true
            //showAngleIndicator: true //显示物体中心岛到边缘的连接线
        }
    });

  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: windowWidth, y: 2000 }
});
    Render.run(render);


  
    // create runner
    var runner = Runner.create({
    delta: 1000 / (60 * 10),
    maxFrameTime: 1000 / 50
    });
    Runner.run(runner, engine);
  
  
  // add bodies
    var particleOptions = { 
        friction: 0.05,
        frictionStatic: 0.1,
        render: { visible: true } 
    };
  
 // add bridge链锁
    var group = Body.nextGroup(true);

    var bridge = Composites.stack(windowWidth/2.62, 1400, 8, 1, 0, 0, //0, 400：链锁起始位置。10, 1：矩形块的数量（10 列，1 行）。0, 0：矩形块之间的水平和垂直间距。
                                  function(x, y) {
        return Bodies.rectangle(x - 10, y, 25, 15, { 
            collisionFilter: { group: group },
            chamfer: 5,//给矩形块添加圆角，增强视觉效果。
            density: 0.1,//指定刚体密度，影响其质量。
            frictionAir: 0.05,
         // restitution: 20,
            label: 'target', // 添加标识
            render: { fillStyle: '#060a19' },
//          collisionFilter: {
//        category: 0x0001 // 分配到类别 0x0002
//    }
        });
    });
    
    Composites.chain(bridge, 0.3, 0, -0.3, 0, { 
        stiffness: 0.99,
        length:  8,
       // damping: 0.01, // 添加阻尼。阻尼系数，减少振动和摆动。
        render: {
            visible: true
        },
      label: 'target', // 添加标识
    });
  
  
   Composite.add(world, [
        bridge,
        Constraint.create({ 
            pointA: { x: windowWidth/2.62, y: 1400 }, 
            bodyB: bridge.bodies[0], 
            pointB: { x: -5, y: 0 },
            length: 1,
            stiffness: 0.05
        }),
        Constraint.create({ 
            pointA: { x: windowWidth/1.75, y: 1400 }, 
            bodyB: bridge.bodies[bridge.bodies.length - 1], 
            pointB: { x: 5, y: 0 },
            length: 1,
            stiffness: 0.05
        })
    ]);
  
//hangingball
  function createHangingBall(x, y, radius, world, label = 'target') {
    var body = Bodies.circle(x, y, radius, {
        frictionAir: 0,
        friction: 0,
        restitution: 1,
        label: 'target',
    });
    var constraint = Constraint.create({
        pointA: { x: x, y: 0 }, // 挂点
        bodyB: body,
        pointB: { x: 0, y: 0 }
    });
    Composite.add(world, [body, constraint]);
    return body;
}

// 使用函数创建多个悬挂的球
createHangingBall(windowWidth/25, 150*2, 20, world);
createHangingBall(windowWidth/25*24, 190*2, 30, world);
createHangingBall(windowWidth/25*23, 130*2, 20, world);
//createHangingBall(windowWidth/25*22, 170*2, 25, world);
createHangingBall(windowWidth/25*21, 120*2, 25, world);
//createHangingBall(windowWidth/25*20, 150*2, 30, world);
createHangingBall(windowWidth/25*19, 120*2, 30, world);
//createHangingBall(windowWidth/25*18, 170*2, 25, world);
createHangingBall(windowWidth/25*17, 140*2, 30, world);
createHangingBall(windowWidth/25*16, 160*2, 30, world);
//createHangingBall(windowWidth/25*15, 200*2, 35, world);
createHangingBall(windowWidth/25*14, 150*2, 25, world);
//createHangingBall(windowWidth/25*13, 170*2, 20, world);
//createHangingBall(windowWidth/25*12, 170*2, 25, world);
//createHangingBall(windowWidth/25*11, 140*2, 30, world);
createHangingBall(windowWidth/25*10, 160*2, 30, world);
//createHangingBall(windowWidth/25*9, 200*2, 35, world);
createHangingBall(windowWidth/25*8, 150*2, 25, world);
//createHangingBall(windowWidth/25*7, 190*2, 30, world);
createHangingBall(windowWidth/25*6, 140*2, 35, world);
//createHangingBall(windowWidth/25*5, 170*2, 25, world);
//createHangingBall(windowWidth/25*4, 120*2, 15, world);
//createHangingBall(windowWidth/25*3, 130*2, 30, world);
createHangingBall(windowWidth/25*2, 140*2, 15, world);
//createHangingBall(windowWidth/2+30, 170*2, 20, world);
createHangingBall(windowWidth-60, 200*2, 25, world);
  
  
// 函数：创建可移动矩形
function createMovingRectangle(xStart, xMin, xMax, y, width, height, speed, label= 'target') {
    var direction = 1; // 初始方向向右
    var rectangle = Bodies.rectangle(xStart, y, width, height, { isStatic: true,
        label: 'target', // 设置 label
        restitution: 1 // 设置 restitution
        });
    Composite.add(world, rectangle);

    // 添加运动逻辑
    Matter.Events.on(engine, 'beforeUpdate', function() {
        if (rectangle.position.x >= xMax) {
            direction = -1; // 向左
        } else if (rectangle.position.x <= xMin) {
            direction = 1; // 向右
        }
        Body.setPosition(rectangle, {
            x: rectangle.position.x + direction * speed,
            y: y
        });
    });
}

// 创建多个可移动矩形
createMovingRectangle(10, windowWidth/25, 150*3, 800, 100, 5, 0.333); 
createMovingRectangle(100, windowWidth/25*3, 300*3, 900, 80, 7, 0.25); 
createMovingRectangle(100, windowWidth/25*3, 300*3, 900, 80, 7, 0.25); 
createMovingRectangle(10, windowWidth/25*1, windowWidth/25*10, 600, 50, 7, 0.25); 
createMovingRectangle(150, 100, windowWidth/25*23, 700, 50, 7, 0.25); 

  
 // 封装创建跷跷板的函数
function createSeesaw(x, y, width, height, label='target', angularVelocity) {
    var body = Bodies.rectangle(x, y, width, height, { label: label });
    var constraint = Constraint.create({
        pointA: { x: x, y: y },
        bodyB: body,
        length: 0,
       label: 'target', 
        isStatic: false
    });
    // 添加一个约束，使跷跷板围绕点 A 旋转
    var constraint = Constraint.create({
        pointA: { x: x, y: y }, // 锚点
        bodyB: body,  // 约束的刚体
        length: 0  // 保持刚体与锚点重合
    });
    Composite.add(world, [body, constraint]);
  
  // 设置旋转速度
    Events.on(engine, 'beforeUpdate', function() {
        // 设置跷跷板的角速度
        Body.setAngularVelocity(body, angularVelocity);
    });
}

// 添加跷跷板
createSeesaw(250, 200, 150, 7, 'target', -0.03);
createSeesaw(210, 800, 200, 7, 'target', -0.03); 
createSeesaw(800, 350, 150, 7, 'target', -0.03); 
createSeesaw(660, 1000, 240, 7, 'target', 0.03);  
createSeesaw(630, 450, 150, 7, 'target', 0.03); 
createSeesaw(600, 600, 100, 7, 'target', -0.03);  
createSeesaw(1000, 700, 150, 7, 'target', -0.03);  
createSeesaw(250, 600, 100, 7, 'target', 0.03);   
createSeesaw(100, 450, 150, 7, 'target', 0.03);   
createSeesaw(400, 1000, 100, 7, 'target', -0.03); 
createSeesaw(200, 1200, 150, 7, 'target', -0.03); 
createSeesaw(800, 800, 150, 7, 'target', 0.03); 
createSeesaw(900, 1300, 150, 7, 'target', -0.03); 
createSeesaw(950, 1100, 150, 7, 'target', 0.03); 
 
 

  
  
let generatedBallsCount = 0; // 定义全局变量
let maxBalls = 500; // 最大生成数量

function handleCollision(event) {
  if (generatedBallsCount < maxBalls) {
    generateSmallBalls(event); // 生成小球
    generatedBallsCount++; // 更新计数
  }
}

function generateSmallBalls(event) {
  // 小球生成逻辑
  let newBall = createBall(event.x, event.y); // 示例函数
  World.add(engine.world, newBall); // Matter.js 添加新小球
}

  
// add ball 球
    var ball = Bodies.circle(windowWidth/2, windowHeight/4*3, 20, {
        frictionAir: 0.05, 
        friction: 0.3,
        restitution: 1,
        angle: 0,
        label: 'mainBall', // 添加标识
//        collisionFilter: {
//        category: 0x0002 // 分配到类别 0x0002
//    }
        });
    Composite.add(world, [ball]);

// 给小球施加向左并向上的力的函数
function applyLeftAndBounceForce(mouseX) {
    var forceX = 0;
    var forceY = -0.1; // 向上的力

    // 判断鼠标是否在小球的左边
    if (mouseX < ball.position.x) {
        forceX = -0.05; // 向左的力
    }
if (mouseX > ball.position.x) {
        forceX = 0.05; // 向右的力
    }
    // 施加力
    Body.applyForce(ball, ball.position, { x: forceX, y: forceY });
}

// 监听鼠标左键点击事件
document.addEventListener('mousedown', function(event) {
    if (event.button === 0) { // 左键点击
        applyLeftAndBounceForce(event.clientX); // 获取鼠标点击的 x 坐标
    }
});
  
  
  var ballTrail = [];
  Events.on(render, 'afterRender', function() {
    // 添加当前物体位置到轨迹
    ballTrail.unshift({
        position: Vector.clone(ball.position), // 记录物体位置
        speed: ball.speed // 记录物体速度
    });

    // 设置渲染的样式和透明度
    Render.startViewTransform(render);
    render.context.globalAlpha = 0.7;

    // 遍历轨迹并绘制点
    for (var i = 0; i < ballTrail.length; i += 1) {
        var point = ballTrail[i].position,
            speed = ballTrail[i].speed;
        
        // 根据速度调整轨迹颜色
        var hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170);
        render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
        render.context.fillRect(point.x, point.y, 2, 2); // 绘制轨迹点
    }

    render.context.globalAlpha = 1;
    Render.endViewTransform(render);

    // 限制轨迹长度，避免无限增长
    if (ballTrail.length > 2000) {
        ballTrail.pop();
    }
});

  
  
Events.on(engine, 'beforeUpdate', function () {
    Composite.allBodies(world).forEach(function (body) {
        if (body.label === 'mainBall') {
            // 检查是否碰到边界
            if (body.position.x < 0 || body.position.x > 1000) {
                // 反弹：水平边界碰撞，改变水平速度方向
                Matter.Body.setVelocity(body, { x: -body.velocity.x, y: body.velocity.y });
            }
            if (body.position.y < 0 || body.position.y > 2000) {
                // 反弹：垂直边界碰撞，改变垂直速度方向
                Matter.Body.setVelocity(body, { x: body.velocity.x, y: -body.velocity.y });
            }
        }
    });
});

  
  
Events.on(engine, 'collisionStart', function (event) {
    var pairs = event.pairs;

    pairs.forEach(function (pair) {
        var bodyA = pair.bodyA;
        var bodyB = pair.bodyB;

        // 确保其中一个是主球
        if (bodyA.label === 'mainBall' || bodyB.label === 'mainBall') {
            var otherBody = (bodyA.label === 'mainBall') ? bodyB : bodyA;

            // 检查碰撞的另一个物体是否是目标
            if (['target'].includes(otherBody.label)) {
                // 避免重复生成
                if (otherBody.generated) return;
                otherBody.generated = true;

                // 创建新小球
                var newBall = Bodies.circle(
                    (pair.bodyA.position.x + pair.bodyB.position.x) / 2,
                    (pair.bodyA.position.y + pair.bodyB.position.y) / 2,
                    5, // 半径
                    {
                        restitution: 0.8,
                        frictionAir: 0.02,
                        render: { fillStyle: 'red' }
                    }
                );

                Composite.add(world, newBall);

                // 更新计数器
                generatedBallsCount++;
            }
        }
    });
});

  
  
  // 在画布下方显示计数
let countDisplay = document.createElement('div');
countDisplay.style.position = 'absolute';
countDisplay.style.bottom = '10px';
countDisplay.style.left = '30%';
countDisplay.style.transform = 'translateX(-50%)';
countDisplay.style.fontSize = '16px';
countDisplay.style.color = '#5599FF';
countDisplay.innerText = `生成的小球数量: ${generatedBallsCount}`;
document.body.appendChild(countDisplay);

// 在每次更新时刷新显示
Events.on(engine, 'afterUpdate', function () {
    countDisplay.innerText = `生成的小球数量: ${generatedBallsCount}`;
});
  


  
// 修复重置按钮逻辑
  let resetButton;
  
function setup() {
     resetButton = createButton('Reset Ball'); // 定义按钮
    resetButton.position(150, 300); // 设置位置
    resetButton.style('background-color', '#ffcc00'); // 样式
    resetButton.style('color', '#E52929');
    resetButton.style('padding', '10px');
    resetButton.mousePressed(resetBall); // 点击按钮触发重置
}
  
  function resetBall() {
    console.log('Ball has been reset!');
    // 在此实现重置逻辑
}

// 重置小球位置的函数
function resetBall() {
    Matter.Body.setPosition(ball, { x: windowWidth/2, y: windowHeight/4*3 }); // 重置位置
    Matter.Body.setVelocity(ball, { x: 0, y: 0 }); // 重置速度
}

  


Composite.add(world, [
    // Walls
    Bodies.rectangle(0, 2000, windowWidth, 50, { 
        isStatic: true, 
        render: { visible: false }, 
        label: 'target' // 为地面添加标签 
    }),
    Bodies.rectangle(0, 0, 50, windowWidth, { 
        isStatic: true, 
        render: { visible: false }, 
        label: 'target' // 为左墙添加标签
    }),
    Bodies.rectangle(0, 0, windowWidth, 50, { 
        isStatic: true, 
        render: { visible: false }, 
        label: 'target' // 为顶部墙添加标签
    }),
    Bodies.rectangle(windowWidth, 0, 50, 2000, { 
        isStatic: true, 
        render: { visible: false }, 
        label: 'target' // 为右墙添加标签
    }),
]);
    

  
    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                // allow bodies on mouse to rotate
               angularStiffness: 0.3,
               stiffness: 0.5,
               render: { visible: false },
//               collisionFilter: {    
//               mask: 0x0001 // 鼠标只控制类别 0x0001 的物体
//        }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;


    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
}
