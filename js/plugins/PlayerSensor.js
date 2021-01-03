/*:ja
 * @target MZ
 * @plugindesc イベントにプレイヤーを検出できる視界を設定します。
 * @author F_
 * 
 * @help
 * 
 * イベントに視界を設定し、視界内に侵入したプレイヤーを検出します。
 * 
 * 
 * ■ 視界の設定
 * 
 * イベントに視界を設定するには、
 * イベントのメモに <sensor: CONFIG> タグを記述します。
 * 
 * CONFIG には次の内容のいずれかを指定します。
 * 複数指定したい場合には空白区切りで記述します。
 * 
 * ○ 視界の形状
 * 
 * 視界の形状を指定するには次の内容を順番に連結して記述します。
 * 
 * 1. 視界の種類
 * 2. 視界の方向（指定可能な種類の場合のみ/省略可）
 * 3. 視界の大きさ
 * 
 * 視界の種類は、英大文字ひとつで次のように表現します。
 * 
 *   L: 直線（方向あり）
 *   F: 台形（方向あり）
 *   D: 菱形
 *   R: 周囲
 *   S: 左右
 * 
 * 視界の方向は、英小文字ひとつで次のように表現します。
 * 
 *   f: 前方（デフォルト）
 *   b: 後方
 *   l: 左方
 *   r: 右方
 * 
 * 視界の大きさは、自然数で指定します。
 * 
 * 複数の形状を指定した場合、視界の形状はそれらの複合形状となります。
 * 
 * 例１）前方5マスの視界
 *   <sensor: Lf5> or <sensor: L5>
 * 
 * 例２）前方距離3マスの台形と周囲1マスの複合形状
 *   <sensor: F3 R1>
 * 
 * ○ 検出時にONとなるセルフスイッチ
 * 
 * プレイヤーを検出した際にONとなるセルフスイッチを指定するには、
 * セルフスイッチのアルファベットを[]で囲って記述します。
 * 省略した場合にはプラグインパラメータで設定した既定値が使用されます。
 * 
 * 例３） 前方2マスと左右1マスの視界で、検出時にセルフスイッチBをONに
 *   <sensor: L2 S1 [B]>
 * 
 * 
 * ■ 障害物の設定
 * 
 * プレイヤーの検出を阻害する障害物として次のものを設定することができます。
 * 
 * 遮蔽物　：視界を遮り、そのマスとそれより奥のマスを検出範囲外とします。
 * 隠れ場所：視界の死角となり、そのマスのみを検出範囲外とします。
 * 
 * 遮蔽物と隠れ場所はそれぞれプラグインパラメータに設定したリージョンIDを、
 * マップ上のマスに設定することにより指定できます。
 * 
 * また、プラグインパラメータの「自動壁検出」を有効にすると、
 * A3およびA4のタイルが設定されたマスが自動的に遮蔽物とみなされます。
 * 
 * 
 * ■ 探索状態の制御
 * 
 * 視界の設定されたイベントはプラグインコマンドによって探索状態を制御します。
 * 
 * 探索状態にないイベントは、例え視界が設定されていても、
 * プレイヤーの検出を行わず、視界も描画されません。
 * 
 * 
 * ---
 * Copyright (c) 2020 F_
 * Released under the MIT license
 * https://github.com/f-space/rmmz-plugins/blob/master/LICENSE
 * 
 * @param ObstacleRegionList
 * @type number[]
 * @min 1
 * @max 255
 * @default []
 * @text 遮蔽物リージョンID
 * @desc 遮蔽物とみなすリージョンのID。
 * 
 * @param BlindSpotRegionList
 * @type number[]
 * @min 1
 * @max 255
 * @default []
 * @text 隠れ場所リージョンID
 * @desc 隠れ場所とみなすリージョンのID。
 * 
 * @param DefaultSelfSwitch
 * @type select
 * @option A
 * @option B
 * @option C
 * @option D
 * @default A
 * @text セルフスイッチの既定値
 * @desc プレイヤー発見時にONとなるセルフスイッチの既定値。
 * 
 * @param UseAutoWallDetection
 * @type boolean
 * @default true
 * @text 自動壁検出
 * @desc A3およびA4のタイルを自動的に遮蔽物とみなすかどうか。
 * 
 * @param SightColor
 * @type string
 * @default rgb(255,255,255)
 * @text 視界の色
 * @desc 描画される視界の色。
 * 
 * @param SightOpacity
 * @type number
 * @min 0
 * @max 255
 * @default 128
 * @text 視界の不透明度
 * @desc 描画される視界の不透明度。
 * 
 * @param SightLayerZ
 * @type number
 * @min 0
 * @max 10
 * @default 4
 * @text 視界のレイヤー
 * @desc 視界を描画するレイヤー。
 * 
 * @param RangeCacheCapacity
 * @type number
 * @min 1
 * @max 256
 * @default 64
 * @text キャッシュ容量
 * @desc キャッシュに記憶する視界範囲の最大数。
 * 
 * @command enable
 * @text 探索の開始
 * @desc 指定されたイベントを探索状態にします。
 * 
 * @arg eventId
 * @type number
 * @default 0
 * @text イベントID
 * @desc 対象のイベントID。
 * 0の場合はこのコマンドを実行したイベントを対象とする。
 * 
 * @command disable
 * @text 探索の終了
 * @desc 指定されたイベントの非探索状態にします。
 * 
 * @arg eventId
 * @type number
 * @default 0
 * @text イベントID
 * @desc 対象のイベントID。
 * 0の場合はこのコマンドを実行したイベントを対象とする。
 */

"use strict";

{
	const parseArray = (parser, s) => JSON.parse(s).map(parser);

	const PLUGIN_NAME = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
	const PARAMS = PluginManager.parameters(PLUGIN_NAME);
	const OBSTACLE_REGION_LIST = parseArray(s => Number.parseInt(s, 10), PARAMS["ObstacleRegionList"]);
	const BLIND_SPOT_REGION_LIST = parseArray(s => Number.parseInt(s, 10), PARAMS["BlindSpotRegionList"]);
	const DEFAULT_SELF_SWITCH = PARAMS["DefaultSelfSwitch"];
	const USE_AUTO_WALL_DETECTION = PARAMS["UseAutoWallDetection"];
	const SIGHT_COLOR = PARAMS["SightColor"];
	const SIGHT_OPACITY = PARAMS["SightOpacity"];
	const SIGHT_LAYER_Z = Number.parseInt(PARAMS["SightLayerZ"], 10) - 0.5;
	const RANGE_CACHE_CAPACITY = Number.parseInt(PARAMS["RangeCacheCapacity"], 10);

	const TAG_SENSOR = "sensor";

	const SHAPE_LINE = "line";
	const SHAPE_FAN = "fan";
	const SHAPE_DIAMOND = "diamond";
	const SHAPE_RECT = "rect";

	const SIGHT_FADE_DURATION = 16;
	const MAX_POSITION_LOG = 4;

	const SENSOR_TAG_CACHE = new WeakMap();

	const getSensorTag = meta => {
		const tag = meta[TAG_SENSOR];
		if (typeof tag === 'string') {
			if (SENSOR_TAG_CACHE.has(meta)) {
				return SENSOR_TAG_CACHE.get(meta);
			} else {
				const value = parseSensorTag(tag);
				SENSOR_TAG_CACHE.set(meta, value);
				return value;
			}
		} else {
			return undefined;
		}
	};

	const parseSensorTag = s => {
		const SHAPE_RE = /^([LF][fblr]?|[DRS])(\d+)$/;
		const SWITCH_RE = /^\[[A-D]\]$/;
		const tokens = s.trim().split(/\s+/);
		return tokens.reduce(({ shapes, switchCh }, token) => {
			const match = token.match(SHAPE_RE);
			if (match !== null) {
				const [, s, n] = match;
				const newShapes = parseShape(s, Number.parseInt(n, 10));
				return { shapes: [...shapes, ...newShapes], switchCh };
			} else if (SWITCH_RE.test(token)) {
				const switchCh = token.slice(1, -1);
				return { shapes, switchCh };
			} else {
				throw new Error(`Invalid token: ${token}`);
			}
		}, { shapes: [], switchCh: DEFAULT_SELF_SWITCH });
	};

	const parseShape = (specifier, size) => {
		const [type, direction] = specifier;
		const rot = direction !== undefined ? parseRotation(direction) : 0;
		switch (type) {
			case 'L': return [{ type: SHAPE_LINE, rot, size }];
			case 'F': return [{ type: SHAPE_FAN, rot, size }];
			case 'D': return [{ type: SHAPE_DIAMOND, rot, size }];
			case 'R': return [{ type: SHAPE_RECT, rot, size }];
			case 'S': return [{ type: SHAPE_LINE, rot: 90, size }, { type: SHAPE_LINE, rot: 270, size }];
			default: throw new Error(`Invalid shape: ${type}`);
		}
	};

	const parseRotation = direction => {
		switch (direction) {
			case 'f': return 0;
			case 'b': return 180;
			case 'l': return 270;
			case 'r': return 90;
			default: throw new Error(`Invalid direction: ${direction}`);
		}
	};

	const dirToRot = direction => {
		switch (direction) {
			case 2: return 0;
			case 4: return 90;
			case 6: return 270;
			case 8: return 180;
			default: throw new Error(`Invalid direction: ${direction}`);
		}
	};

	const globalMatrix = (shape, x, y, d) => {
		const angle = (shape.rot + dirToRot(d)) % 360;
		const translation = Mat.translate(x, y);
		const rotation = Mat.rotate(angle);
		return Mat.mul(translation, rotation);
	};

	const globalBoundingBox = (shape, x, y, d) => {
		const rect = localBoundingBoxNotRot(shape);
		const mat = globalMatrix(shape, x, y, d);
		return Rect.transform(rect, mat);
	};

	const localBoundingBoxNotRot = shape => {
		const { type, size } = shape;
		switch (type) {
			case SHAPE_LINE: return Rect.make(0, 1, 1, size);
			case SHAPE_FAN: return Rect.make(-size, 1, size * 2 + 1, size);
			case SHAPE_DIAMOND: return Rect.make(-size, -size, size * 2 + 1, size * 2 + 1);
			case SHAPE_RECT: return Rect.make(-size, -size, size * 2 + 1, size * 2 + 1);
			default: throw new Error(`Invalid shape: ${type}`);
		}
	};

	const sensorRange = (shape, x, y, d, isObstacle) => {
		const { type } = shape;
		const mat = globalMatrix(shape, x, y, d);
		switch (type) {
			case SHAPE_LINE: return lineSensor(shape, mat, isObstacle);
			case SHAPE_FAN: return fanSensor(shape, mat, isObstacle);
			case SHAPE_DIAMOND: return diamondSensor(shape, mat, isObstacle);
			case SHAPE_RECT: return rectSensor(shape, mat, isObstacle);
			default: throw new Error(`Invalid shape: ${type}`);
		}
	};

	const lineSensor = (shape, mat, isObstacle) => {
		const { size } = shape;
		const { x: sx, y: sy } = Mat.apply(mat, Vec.make(0, 1));
		const { x: dx, y: dy } = Mat.applyRot(mat, Vec.make(0, 1));

		const range = [];
		for (let i = 0; i < size; i++) {
			const x = sx + dx * i;
			const y = sy + dy * i;
			if (!isObstacle(x, y)) {
				range.push(Vec.make(x, y));
			} else {
				break;
			}
		}

		return range;
	};

	const fanSensor = (shape, mat, isObstacle) => {
		const { size } = shape;
		const toGlobal = coordinateTransformer(mat);
		const isCovered = fanSensorCoverDetector(size, (h, v) => {
			const { x, y } = toGlobal(h, v);
			return isObstacle(x, y);
		});

		const range = [];
		for (let v = 1; v <= size; v++) {
			for (let h = -v; h <= v; h++) {
				if (!isCovered(h, v)) {
					range.push(toGlobal(h, v));
				}
			}
		}

		return range;
	};

	const fanSensorCoverDetector = (size, isObstacle) => {
		const covered = Array(size * (size + 2)).fill(undefined);
		const isCovered = (h, v) => {
			const index = (v * v - 1) + (h + v);
			const state = covered[index];
			if (state !== undefined) {
				return state;
			} else {
				return covered[index] = isCoveredWithOther(h, v) || isObstacle(h, v);
			}
		};
		const isCoveredWithOther = (h, v) => {
			const s = Math.sign(h);
			if (h === 0) {
				return v !== 1 && isCovered(h, v - 1);
			} else if (v === Math.abs(h)) {
				return (v !== 1 && isCovered(h - s, v - 1)) || isCovered(h - s, v);
			} else {
				return isCovered(h - s, v - 1) || isCovered(h, v - 1);
			}
		};

		return isCovered;
	};

	const diamondSensor = (shape, mat, isObstacle) => {
		const { size } = shape;
		const toGlobal = coordinateTransformer(mat);
		const isCovered = rectSensorCoverDetector(size, (h, v) => {
			const { x, y } = toGlobal(h, v);
			return isObstacle(x, y);
		});

		const range = [];
		for (let v = -size; v <= size; v++) {
			const w = size - Math.abs(v);
			for (let h = -w; h <= w; h++) {
				if ((h !== 0 || v !== 0) && !isCovered(h, v)) {
					range.push(toGlobal(h, v));
				}
			}
		}

		return range;
	};

	const rectSensor = (shape, mat, isObstacle) => {
		const { size } = shape;
		const toGlobal = coordinateTransformer(mat);
		const isCovered = rectSensorCoverDetector(size, (h, v) => {
			const { x, y } = toGlobal(h, v);
			return isObstacle(x, y);
		});

		const range = [];
		for (let v = -size; v <= size; v++) {
			for (let h = -size; h <= size; h++) {
				if ((h !== 0 || v !== 0) && !isCovered(h, v)) {
					range.push(toGlobal(h, v));
				}
			}
		}

		return range;
	};

	const rectSensorCoverDetector = (size, isObstacle) => {
		const FLAG_NONE = 0;
		const FLAG_DIAGONAL = 1;
		const FLAG_PARALLEL = 2;

		const edge = size * 2 + 1;
		const covered = Array(edge * edge).fill(undefined);
		const isCovered = (h, v) => {
			const index = (h + size) + (v + size) * edge;
			const state = covered[index];
			if (state !== undefined) {
				return state;
			} else {
				return covered[index] = isCoveredWithOther(h, v) | isCoveredWithSelf(h, v);
			}
		};
		const isCoveredWithOther = (h, v) => {
			if (h === 0 && v === 0) {
				return FLAG_NONE;
			} else if (h === 0) {
				return isCovered(h, v - Math.sign(v)) & FLAG_DIAGONAL;
			} else if (v === 0) {
				return isCovered(h - Math.sign(h), v) & FLAG_DIAGONAL;
			} else {
				const h2 = h - Math.sign(h);
				const v2 = v - Math.sign(v);
				const diag = isCovered(h2, v2) & FLAG_DIAGONAL;
				const horz = isCovered(h2, v) & FLAG_PARALLEL;
				const vert = isCovered(h, v2) & FLAG_PARALLEL;
				return diag | horz | vert;
			}
		};
		const isCoveredWithSelf = (h, v) => {
			if (h === 0 && v === 0) {
				return FLAG_NONE;
			} else if (h === 0 || v === 0) {
				return isObstacle(h, v) ? FLAG_DIAGONAL : FLAG_NONE;
			} else {
				return isObstacle(h, v) ? FLAG_PARALLEL : FLAG_NONE;
			}
		};

		return (h, v) => isCovered(h, v) !== FLAG_NONE;
	};

	const coordinateTransformer = mat => {
		const { x: sx, y: sy } = Mat.apply(mat, Vec.make(0, 0));
		const { x: hx, y: hy } = Mat.applyRot(mat, Vec.make(1, 0));
		const { x: vx, y: vy } = Mat.applyRot(mat, Vec.make(0, 1));

		return (h, v) => {
			const x = sx + hx * h + vx * v;
			const y = sy + hy * h + vy * v;
			return Vec.make(x, y);
		};
	};

	const Vec = (() => {
		const make = (x, y) => ({ x, y });

		return { make };
	})();

	const Rect = (() => {
		const make = (x, y, w, h) => ({ x, y, w, h });

		const transform = (rect, mat) => {
			const { x, y, w, h } = rect;
			if (w !== 0 && h !== 0) {
				const { x: x1, y: y1 } = Mat.apply(mat, Vec.make(x, y));
				const { x: x2, y: y2 } = Mat.apply(mat, Vec.make(x + w - 1, y + h - 1));
				const [nx, nw] = x1 < x2 ? [x1, x2 - x1 + 1] : [x2, x1 - x2 + 1];
				const [ny, nh] = y1 < y2 ? [y1, y2 - y1 + 1] : [y2, y1 - y2 + 1];
				return make(nx, ny, nw, nh);
			} else {
				const { x: nx, y: ny } = Mat.apply(mat, Vec.make(x, y));
				const { x: sw, y: sh } = Mat.applyRot(mat, Vec.make(w, h));
				const nw = Math.abs(sw);
				const nh = Math.abs(sh);
				return make(nx, ny, nw, nh);
			}
		};

		return { make, transform };
	})();

	const Mat = (() => {
		const make = (m00, m01, m02, m10, m11, m12) => [m00, m01, m02, m10, m11, m12];

		const translate = (dx, dy) => make(1, 0, dx, 0, 1, dy);

		const rotate = angle => {
			switch (angle) {
				case 0: return make(1, 0, 0, 0, 1, 0);
				case 90: return make(0, -1, 0, 1, 0, 0);
				case 180: return make(-1, 0, 0, 0, -1, 0);
				case 270: return make(0, 1, 0, -1, 0, 0);
				default: throw new Error(`Unsupported angle: ${angle}`);
			}
		};

		const mul = (a, b) => {
			const [a00, a01, a02, a10, a11, a12] = a;
			const [b00, b01, b02, b10, b11, b12] = b;
			return make(
				a00 * b00 + a01 * b10, a00 * b01 + a01 * b11, a00 * b02 + a01 * b12 + a02,
				a10 * b00 + a11 * b10, a10 * b01 + a11 * b11, a10 * b02 + a11 * b12 + a12,
			);
		};

		const apply = (mat, point) => {
			const [m00, m01, m02, m10, m11, m12] = mat;
			const { x, y } = point;
			return Vec.make(m00 * x + m01 * y + m02, m10 * x + m11 * y + m12);
		};

		const applyRot = (mat, point) => {
			const [m00, m01, , m10, m11,] = mat;
			const { x, y } = point;
			return Vec.make(m00 * x + m01 * y, m10 * x + m11 * y);
		};

		return { make, translate, rotate, mul, apply, applyRot };
	})();

	class LruCache {
		constructor(capacity) {
			this.capacity = capacity;
			this.map = new Map();
		}

		get(key, compute) {
			const { capacity, map } = this;
			if (map.has(key)) {
				const value = map.get(key);
				map.delete(key);
				map.set(key, value);
				return value;
			} else {
				if (map.size === capacity) {
					map.delete(map.keys().next().value);
				}

				const value = compute();
				map.set(key, value);
				return value;
			}
		}
	}

	const RangeCache = new LruCache(RANGE_CACHE_CAPACITY);

	class SightSprite extends Sprite {
		initialize() {
			super.initialize(null);
		}

		update() {
			const sights = this.sights();
			const bitmap = this.updateBitmap(sights);
			this.refresh(bitmap, sights);
		}

		updateBitmap(sights) {
			const bitmap = this.bitmap;
			if (bitmap === null && sights.length !== 0) {
				return this.bitmap = new Bitmap(Graphics.width, Graphics.height);
			} else {
				return bitmap;
			}
		}

		sights() {
			return $gameMap.events().flatMap(event => {
				const entries = this.entries(event);
				const motion = entries.flatMap(entry => {
					const { event, shapes, position, ...rest } = entry;
					const range = this.range(event, shapes, position);
					return range.size !== 0 ? [{ range, ...rest }] : [];
				});
				return motion.length !== 0 ? [{ event, motion }] : [];
			});
		}

		entries(event) {
			const sensor = event.sensor();
			if (sensor !== undefined) {
				const { shapes } = sensor;
				const log = event.sensorPositionLog();
				const weights = this.logWeights(event, log);
				const totalWeight = weights.reduce((sum, w) => sum + w, 0);
				return log.flatMap(({ position }, i) => {
					const weight = weights[i];
					const intensity = weight / totalWeight;
					return intensity !== 0 ? [{ event, shapes, position, intensity }] : [];
				});
			} else {
				return [];
			}
		}

		logWeights(event, log) {
			const timeFromStart = this.logElapsedTime(log);
			const timeFromEnd = [...timeFromStart.slice(1), 0];
			const timeScale = 2 ** (event.realMoveSpeed() - 4);
			const duration = Math.round(SIGHT_FADE_DURATION / timeScale);
			return log.map((_, i) => {
				const fromStart = timeFromStart[i];
				const fromEnd = timeFromEnd[i];
				const s = Math.min(Math.max(fromStart / duration, 0), 1);
				const t = Math.min(Math.max((duration - fromEnd) / duration, 0), 1);
				const u = Math.min(s, t);
				return u * u * (3 - 2 * u);
			});
		}

		logElapsedTime(log) {
			return log.map(entry => entry.time).reduceRight((list, time) => {
				const sum = list.length !== 0 ? list[0] : 0;
				return [sum + time, ...list];
			}, []);
		}

		range(event, shapes, position) {
			const width = $gameMap.width();
			const range = new Set();
			for (const shape of shapes) {
				if (this.inScreen(event, shape, position)) {
					const points = this.shapeRange(event, shape, position);
					for (const { x, y } of points) {
						const index = x + y * width;
						range.add(index);
					}
				}
			}
			return range;
		}

		inScreen(event, shape, position) {
			const bb = event.sensorBoundingBox(shape, position);
			return $gameMap.intersectWithScreen(bb);
		}

		shapeRange(event, shape, position) {
			return event.sensorRange(shape, position).flatMap(({ x, y }) => {
				const valid = $gameMap.isValid(x, y) && !$gameMap.isSensorBlindSpot(x, y);
				return valid ? [Vec.make(x, y)] : [];
			});
		}

		refresh(bitmap, sights) {
			if (bitmap !== null) {
				bitmap.clear();

				this.drawTiles(bitmap, sights);
			}
		}

		drawTiles(bitmap, sights) {
			const { x: sx, y: sy, w, h } = $gameMap.screenBoundingBox();
			const width = $gameMap.width();
			const tw = $gameMap.tileWidth();
			const dx = sx - $gameMap.displayX();
			const dy = sy - $gameMap.displayY();

			for (let yi = 0; yi < h; yi++) {
				const y = $gameMap.roundY(sy + yi);
				for (let xi = 0; xi < w; xi++) {
					const x = $gameMap.roundX(sx + xi);

					const index = x + y * width;
					for (const { motion } of sights) {
						const intensity = motion.reduce((v, m) => m.range.has(index) ? v + m.intensity : v, 0);
						if (intensity !== 0) {
							bitmap.paintOpacity = Math.round(SIGHT_OPACITY * Math.min(intensity, 1));
							bitmap.fillRect((xi + dx) * tw, (yi + dy) * tw, tw, tw, SIGHT_COLOR);
						}
					}
				}
			}
		}
	}

	PluginManager.registerCommand(PLUGIN_NAME, "enable", function (args) {
		const eventIdArg = Number.parseInt(args["eventId"], 10);
		const eventId = eventIdArg !== 0 ? eventIdArg : this._eventId;
		const event = $gameMap.event(eventId);
		event.setSensorEnabled(true);
	});

	PluginManager.registerCommand(PLUGIN_NAME, "disable", function (args) {
		const eventIdArg = Number.parseInt(args["eventId"], 10);
		const eventId = eventIdArg !== 0 ? eventIdArg : this._eventId;
		const event = $gameMap.event(eventId);
		event.setSensorEnabled(false);
	});

	Game_Map.prototype.intersectWithScreen = function (rect) {
		return this.isRectsIntersected(this.screenBoundingBox(), rect);
	};

	Game_Map.prototype.screenBoundingBox = function () {
		const sx = this.displayX();
		const sy = this.displayY();
		const sw = this.screenTileX();
		const sh = this.screenTileY();
		const x = Math.floor(sx);
		const y = Math.floor(sy);
		const w = Math.ceil(sx + sw) - x;
		const h = Math.ceil(sy + sh) - y;
		return Rect.make(x, y, w, h);
	};

	Game_Map.prototype.isRectsIntersected = function (a, b) {
		const { x: ax, y: ay, w: aw, h: ah } = a;
		const { x: bx, y: by, w: bw, h: bh } = b;
		const condX = () => {
			if ($gameMap.isLoopHorizontal()) {
				const x0 = $gameMap.roundX(ax);
				const x1 = $gameMap.roundX(bx + bw);
				const al = x0;
				const br = x0 < x1 ? x1 : x1 + $gameMap.width();
				return br - bw < al + aw;
			} else {
				return ax < bx + bw && bx < ax + aw;
			}
		};
		const condY = () => {
			if ($gameMap.isLoopVertical()) {
				const y0 = $gameMap.roundY(ay);
				const y1 = $gameMap.roundY(by + bh);
				const at = y0;
				const bb = y0 < y1 ? y1 : y1 + $gameMap.height();
				return bb - bh < at + ah;
			} else {
				return ay < by + bh && by < ay + ah;
			}
		};
		return condX() && condY();
	};

	Game_Map.prototype.isPointContained = function (rect, point) {
		const { x: rx, y: ry, w: rw, h: rh } = rect;
		const { x, y } = point;
		const condX = () => {
			if ($gameMap.isLoopHorizontal()) {
				const x0 = $gameMap.roundX(rx);
				const x1 = $gameMap.roundX(x);
				const x2 = x0 <= x1 ? x1 : x1 + $gameMap.width();
				return x2 >= x0 && x2 < x0 + rw;
			} else {
				return x >= rx && x < rx + rw;
			}
		};
		const condY = () => {
			if ($gameMap.isLoopVertical()) {
				const y0 = $gameMap.roundY(ry);
				const y1 = $gameMap.roundY(y);
				const y2 = y0 <= y1 ? y1 : y1 + $gameMap.height();
				return y2 >= y0 && y2 < y0 + rh;
			} else {
				return y >= ry && y < ry + rh;
			}
		};
		return condX() && condY();
	};

	Game_Map.prototype.isSensorObstacle = function (x, y) {
		if (USE_AUTO_WALL_DETECTION) {
			const tileId = this.tileId(x, y, 0);
			if (Tilemap.isTileA3(tileId) || Tilemap.isTileA4(tileId)) {
				return true;
			}
		}

		return OBSTACLE_REGION_LIST.includes(this.regionId(x, y));
	};

	Game_Map.prototype.isSensorBlindSpot = function (x, y) {
		return BLIND_SPOT_REGION_LIST.includes(this.regionId(x, y));
	};

	Game_Player.prototype.sensorX = function () {
		return $gameMap.roundX(Math.round(this._realX));
	};

	Game_Player.prototype.sensorY = function () {
		return $gameMap.roundY(Math.round(this._realY));
	};

	const Game_Event_initMembers = Game_Event.prototype.initMembers;
	Game_Event.prototype.initMembers = function () {
		Game_Event_initMembers.apply(this, arguments);

		this._sensorEnabled = false;
		this._sensorPositionLog = [];
	};

	Game_Event.prototype.isSensorEnabled = function () {
		return this._sensorEnabled;
	};

	Game_Event.prototype.setSensorEnabled = function (value) {
		this._sensorEnabled = value;
	};

	Game_Event.prototype.isSensorActive = function () {
		return this.isSensorEnabled() && this.page() !== undefined;
	};

	Game_Event.prototype.sensor = function () {
		return this.isSensorActive() ? getSensorTag(this.event().meta) : undefined;
	};

	Game_Event.prototype.sensorX = function () {
		return this.x;
	};

	Game_Event.prototype.sensorY = function () {
		return this.y;
	};

	Game_Event.prototype.sensorPosition = function () {
		const x = this.sensorX();
		const y = this.sensorY();
		const d = this.direction();
		return { x, y, d };
	};

	Game_Event.prototype.sensorPositionLog = function () {
		return this._sensorPositionLog;
	};

	Game_Event.prototype.sensorBoundingBox = function (shape, position) {
		const { x, y, d } = position;
		return globalBoundingBox(shape, x, y, d);
	};

	Game_Event.prototype.sensorRange = function (shape, position) {
		const { x, y, d } = position;
		const mapId = $gameMap.mapId();
		const key = JSON.stringify([mapId, shape, x, y, d]);
		return RangeCache.get(key, () => {
			const isObstacle = (x, y) => {
				const rx = $gameMap.roundX(x);
				const ry = $gameMap.roundY(y);
				return !$gameMap.isValid(rx, ry) || $gameMap.isSensorObstacle(rx, ry);
			};
			return sensorRange(shape, x, y, d, isObstacle).map(point => {
				const rx = $gameMap.roundX(point.x);
				const ry = $gameMap.roundY(point.y);
				return Vec.make(rx, ry);
			});
		});
	};

	const Game_Event_update = Game_Event.prototype.update;
	Game_Event.prototype.update = function () {
		Game_Event_update.apply(this, arguments);

		this.logSensorPosition();
	};

	Game_Event.prototype.logSensorPosition = function () {
		const positionEqual = (a, b) => a.x === b.x && a.y === b.y && a.d === b.d;

		if (this.isSensorActive()) {
			const log = this._sensorPositionLog;
			const position = this.sensorPosition();
			if (log.length === 0) {
				this._sensorPositionLog = [{ position, time: 0 }];
			} else {
				const last = log[log.length - 1];
				if (positionEqual(last.position, position)) {
					last.time++;
				} else {
					const prevLog = log.slice(1 - MAX_POSITION_LOG);
					this._sensorPositionLog = [...prevLog, { position, time: 0 }];
				}
			}
		} else {
			this._sensorPositionLog = [];
		}
	};

	Game_Event.prototype.updateSensor = function (x, y) {
		const sensor = this.sensor();
		if (sensor !== undefined) {
			const mapId = this._mapId;
			const eventId = this.eventId();
			const { switchCh } = sensor;
			const key = [mapId, eventId, switchCh];
			if (!$gameSelfSwitches.value(key) && this.detectsPlayerWithSensor(x, y)) {
				$gameSelfSwitches.setValue(key, true);
			}
		}
	};

	Game_Event.prototype.detectsPlayerWithSensor = function (x, y) {
		const { shapes } = this.sensor();
		const position = this.sensorPosition();
		return shapes.some(shape => {
			const bb = this.sensorBoundingBox(shape, position);
			if ($gameMap.isPointContained(bb, Vec.make(x, y))) {
				const range = this.sensorRange(shape, position);
				return range.some(p => p.x === x && p.y === y);
			}
			return false;
		});
	};

	const Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
	Spriteset_Map.prototype.createLowerLayer = function () {
		Spriteset_Map_createLowerLayer.apply(this, arguments);

		this.createSensorSightSprite();
	};

	Spriteset_Map.prototype.createSensorSightSprite = function () {
		const sprite = new SightSprite();
		sprite.z = SIGHT_LAYER_Z;
		this._tilemap.addChild(sprite);
	};

	const Scene_Map_updateMain = Scene_Map.prototype.updateMain;
	Scene_Map.prototype.updateMain = function () {
		Scene_Map_updateMain.apply(this, arguments);

		if (this.isActive()) this.updateSensor();
	};

	Scene_Map.prototype.updateSensor = function () {
		const x = $gamePlayer.sensorX();
		const y = $gamePlayer.sensorY();
		if ($gamePlayer.canMove()) {
			if ($gameMap.isValid(x, y) && !$gameMap.isSensorBlindSpot(x, y)) {
				const events = $gameMap.events();
				for (const event of events) {
					event.updateSensor(x, y);
				}
			}
		}
	};
}