import createSquare from '~/components/Square';

const TILE_SIZE = 80;

export function drawBoard(app) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {            
            let isDark = (row + col) % 2 === 1;
            const fillColor = isDark ? 0x7f7f7f : 0xffffff;

            const square = createSquare({
                x: col * TILE_SIZE,
                y: row * TILE_SIZE,
                size: TILE_SIZE,
                color: fillColor,
              });
        
              app.stage.addChild(square);
        }
    }
}