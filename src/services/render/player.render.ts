import { CONFIG } from "@/config";
import { Team, TEAM_STYLES } from "@app-types/team.type";
import { VISION_CONFIG } from "@app-types/vision.type";
import type { Player } from "@entities/Player";

function resolvePlayerStyle(player: Player, frozen: boolean) {
    const style = TEAM_STYLES[player.team];
    const isFrozen = frozen && player.team === Team.SEEKER;

    if (isFrozen) {
        return {
            fill: style.frozen.fill,
            stroke: style.frozen.stroke,
            direction: style.direction,
        };
    }

    if (player.team === Team.SEEKER) {
        const isSeeing = player.seeing.length > 0;

        return {
            fill: isSeeing ? style.highlight! : style.base,
            stroke: isSeeing ? style.highlightStroke! : style.stroke,
            direction: style.direction,
        };
    }

    return {
        fill: player.spotted ? style.spotted! : style.base,
        stroke: player.spotted ? style.spottedStroke! : style.stroke,
        direction: style.direction,
    };
}

export function drawPlayer(
    ctx: CanvasRenderingContext2D,
    player: Player,
    frozen: boolean,
): void {
    const { x, y } = player.position;
    const radius = CONFIG.PLAYER_RADIUS;
    const { fill, stroke, direction } = resolvePlayerStyle(player, frozen);

    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.arc(2, 3, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(
        Math.cos(player.angle) * (radius + 4),
        Math.sin(player.angle) * (radius + 4),
    );
    ctx.strokeStyle = direction;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = `bold ${radius - 2}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(player.id, 0, 0);

    ctx.restore();
}

function resolveVisionConeStyle(player: Player, frozen: boolean) {
    const vision = TEAM_STYLES[player.team].vision;
    const isFrozen = frozen && player.team === Team.SEEKER;

    if (isFrozen) {
        return {
            fill: vision.frozen,
            stroke: vision.frozenStroke,
        };
    }

    if (player.seeing.length > 0) {
        return {
            fill: vision.highlight,
            stroke: vision.stroke,
        };
    }

    return {
        fill: vision.base,
        stroke: vision.stroke,
    };
}

export function drawVisionCone(
    ctx: CanvasRenderingContext2D,
    player: Player,
    frozen: boolean,
): void {
    const { fill, stroke } = resolveVisionConeStyle(player, frozen);
    const { range, angle } = VISION_CONFIG[player.team];

    ctx.save();
    ctx.translate(player.position.x, player.position.y);
    ctx.rotate(player.angle);

    const half = angle / 2;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, range, -half, half);
    ctx.closePath();

    ctx.fillStyle = fill;
    ctx.fill();

    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
}
