webvn.use(["webgl"], function (webgl) { webgl.Transition.addTransition({
    "HSVfade": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nvec3 hsv2rgb(vec3 c) {\n    const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\nvec3 rgb2hsv(vec3 c) {\n    const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n    float d = q.x - min(q.w, q.y);\n    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);\n}\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec3 a = rgb2hsv(texture2D(from, p).rgb);\n    vec3 b = rgb2hsv(texture2D(to, p).rgb);\n    vec3 m = mix(a, b, progress);\n    vec4 r = vec4(hsv2rgb(m), mix(texture2D(from, p).a, texture2D(to, p).a, progress));\n    gl_FragColor = r;\n}",
    "advancedMosaic": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nvoid main(void)\n{\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    float T = progress;\n    float S0 = 1.0;\n    float S1 = 50.0;\n    float S2 = 1.0;\n    float Half = 0.5;\n    float PixelSize = ( T < Half ) ? mix( S0, S1, T / Half ) : mix( S1, S2, (T-Half) / Half );\n    vec2 D = PixelSize / resolution.xy;\n    vec2 UV = ( p + vec2( -0.5 ) ) / D;\n    vec2 Coord = clamp( D * ( ceil( UV + vec2( -0.5 ) ) ) + vec2( 0.5 ), vec2( 0.0 ), vec2( 1.0 ) );\n    vec4 C0 = texture2D( from, Coord );\n    vec4 C1 = texture2D( to, Coord );\n    gl_FragColor = mix( C0, C1, T );\n}",
    "burn": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nconst vec3 color = vec3(0.9, 0.4, 0.2);\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    gl_FragColor = mix(\n        texture2D(from, p) + vec4(progress*color, 0.0),\n        texture2D(to, p) + vec4((1.0-progress)*color, 0.0),\n        progress);\n}",
    "butterflyWaveScrawler": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nconst float amplitude = 1.0;\nconst float waves = 30.0;\nconst float colorSeparation = 0.3;\nfloat PI = 3.14159265358979323846264;\nfloat compute(vec2 p, float progress, vec2 center) {\n    vec2 o = p*sin(progress * amplitude)-center;\n    vec2 h = vec2(1., 0.);\n    float theta = acos(dot(o, h)) * waves;\n    return (exp(cos(theta)) - 2.*cos(4.*theta) + pow(sin((2.*theta - PI) / 24.), 5.)) / 10.;\n}\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    float inv = 1. - progress;\n    vec2 dir = p - vec2(.5);\n    float dist = length(dir);\n    float disp = compute(p, progress, vec2(0.5, 0.5)) ;\n    vec4 texTo = texture2D(to, p + inv*disp);\n    vec4 texFrom = vec4(\n    texture2D(from, p + progress*disp*(1.0 - colorSeparation)).r,\n    texture2D(from, p + progress*disp).g,\n    texture2D(from, p + progress*disp*(1.0 + colorSeparation)).b,\n    1.0);\n    gl_FragColor = texTo*progress + texFrom*inv;\n}",
    "circleOpen": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from;\nuniform sampler2D to;\nuniform float progress;\nuniform vec2 resolution;\nconst float smoothness = 0.3;\nconst bool opening = true;\nconst vec2 center = vec2(0.5, 0.5);\nconst float SQRT_2 = 1.414213562373;\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    float x = opening ? progress : 1.-progress;\n    float m = smoothstep(-smoothness, 0.0, SQRT_2*distance(center, p) - x*(1.+smoothness));\n    gl_FragColor = mix(texture2D(from, p), texture2D(to, p), opening ? 1.-m : m);\n}",
    "colourDistance": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec4 fTex = texture2D(from,p);\n    vec4 tTex = texture2D(to,p);\n    gl_FragColor = mix(distance(fTex,tTex)>progress?fTex:tTex, tTex, pow(progress,5.0));\n}",
    "crazyParametricFun": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nconst float a = 4.0;\nconst float b = 1.0;\nconst float amplitude = 120.0;\nconst float smoothness = 0.1;\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec2 dir = p - vec2(.5);\n    float dist = length(dir);\n    float x = (a - b) * cos(progress) + b * cos(progress * ((a / b) - 1.) );\n    float y = (a - b) * sin(progress) - b * sin(progress * ((a / b) - 1.));\n    vec2 offset = dir * vec2(sin(progress  * dist * amplitude * x), sin(progress * dist * amplitude * y)) / smoothness;\n    gl_FragColor = mix(texture2D(from, p + offset), texture2D(to, p), smoothstep(0.2, 1.0, progress));\n}",
    "crossHatch": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from;\nuniform sampler2D to;\nuniform float progress;\nuniform vec2 resolution;\nconst vec2 center = vec2(0.5, 0.5);\nfloat quadraticInOut(float t) {\n    float p = 2.0 * t * t;\n    return t < 0.5 ? p : -p + (4.0 * t) - 1.0;\n}\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    if (progress == 0.0) {\n        gl_FragColor = texture2D(from, p);\n    } else if (progress == 1.0) {\n        gl_FragColor = texture2D(to, p);\n    } else {\n        float x = progress;\n        float dist = distance(center, p);\n        float r = x - min(rand(vec2(p.y, 0.0)), rand(vec2(0.0, p.x)));\n        float m = dist <= r ? 1.0 : 0.0;\n        gl_FragColor = mix(texture2D(from, p), texture2D(to, p), m);\n    }\n}",
    "crossZoom": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nconst float PI = 3.141592653589793;\nfloat Linear_ease(in float begin, in float change, in float duration, in float time) {\n    return change * time / duration + begin;\n}\nfloat Exponential_easeInOut(in float begin, in float change, in float duration, in float time) {\n    if (time == 0.0)\n        return begin;\n    else if (time == duration)\n        return begin + change;\n    time = time / (duration / 2.0);\n    if (time < 1.0)\n        return change / 2.0 * pow(2.0, 10.0 * (time - 1.0)) + begin;\n    return change / 2.0 * (-pow(2.0, -10.0 * (time - 1.0)) + 2.0) + begin;\n}\nfloat Sinusoidal_easeInOut(in float begin, in float change, in float duration, in float time) {\n    return -change / 2.0 * (cos(PI * time / duration) - 1.0) + begin;\n}\nfloat random(in vec3 scale, in float seed) {\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\nvec3 crossFade(in vec2 uv, in float dissolve) {\n    return mix(texture2D(from, uv).rgb, texture2D(to, uv).rgb, dissolve);\n}\nvoid main() {\n    vec2 texCoord = gl_FragCoord.xy / resolution.xy;\n    vec2 center = vec2(Linear_ease(0.25, 0.5, 1.0, progress), 0.5);\n    float dissolve = Exponential_easeInOut(0.0, 1.0, 1.0, progress);\n    float strength = Sinusoidal_easeInOut(0.0, 0.4, 0.5, progress);\n    vec3 color = vec3(0.0);\n    float total = 0.0;\n    vec2 toCenter = center - texCoord;\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    for (float t = 0.0; t <= 40.0; t++) {\n        float percent = (t + offset) / 40.0;\n        float weight = 4.0 * (percent - percent * percent);\n        color += crossFade(texCoord + toCenter * percent * strength, dissolve) * weight;\n        total += weight;\n    }\n    gl_FragColor = vec4(color / total, 1.0);\n}",
    "defocusBlur": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform float progress;\nuniform vec2 resolution;\nuniform sampler2D from;\nuniform sampler2D to;\nvoid main(void) {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    float T = progress;\n    float S0 = 1.0;\n    float S1 = 50.0;\n    float S2 = 1.0;\n    float Half = 0.5;\n    float PixelSize = ( T < Half ) ? mix( S0, S1, T / Half ) : mix( S1, S2, (T-Half) / Half );\n    vec2 D = PixelSize / resolution.xy;\n    vec2 UV = (gl_FragCoord.xy / resolution.xy);\n    const int NumTaps = 12;\n    vec2 Disk[NumTaps];\n    Disk[0] = vec2(-.326,-.406);\n    Disk[1] = vec2(-.840,-.074);\n    Disk[2] = vec2(-.696, .457);\n    Disk[3] = vec2(-.203, .621);\n    Disk[4] = vec2( .962,-.195);\n    Disk[5] = vec2( .473,-.480);\n    Disk[6] = vec2( .519, .767);\n    Disk[7] = vec2( .185,-.893);\n    Disk[8] = vec2( .507, .064);\n    Disk[9] = vec2( .896, .412);\n    Disk[10] = vec2(-.322,-.933);\n    Disk[11] = vec2(-.792,-.598);\n    vec4 C0 = texture2D( from, UV );\n    vec4 C1 = texture2D( to, UV );\n    for ( int i = 0; i != NumTaps; i++ )\n    {\n        C0 += texture2D( from, Disk[i] * D + UV );\n        C1 += texture2D( to, Disk[i] * D + UV );\n    }\n    C0 /= float(NumTaps+1);\n    C1 /= float(NumTaps+1);\n    gl_FragColor = mix( C0, C1, T );\n}",
    "directionalWipe": "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D from;\nuniform sampler2D to;\nuniform float progress;\nuniform vec2 resolution;\nconst vec2 direction = vec2(1.0, -1.0);\nconst float smoothness = 0.5;\nconst vec2 center = vec2(0.5, 0.5);\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec2 v = normalize(direction);\n    v /= abs(v.x)+abs(v.y);\n    float d = v.x * center.x + v.y * center.y;\n    float m = smoothstep(-smoothness, 0.0, v.x * p.x + v.y * p.y - (d-0.5+progress*(1.+smoothness)));\n    gl_FragColor = mix(texture2D(to, p), texture2D(from, p), m);\n}",
    "dispersionBlur": "#ifdef GL_ES\nprecision mediump float;\n#endif\n#define QUALITY 32\nuniform sampler2D from;\nuniform sampler2D to;\nuniform float progress;\nuniform vec2 resolution;\nconst float GOLDEN_ANGLE = 2.399963229728653;\nvec4 blur(sampler2D t, vec2 c, float radius) {\n    vec4 sum = vec4(0.0);\n    float q = float(QUALITY);\n    for (int i=0; i<QUALITY; ++i) {\n        float fi = float(i);\n        float a = fi * GOLDEN_ANGLE;\n        float r = sqrt(fi / q) * radius;\n        vec2 p = c + r * vec2(cos(a), sin(a));\n        sum += texture2D(t, p);\n    }\n    return sum / q;\n}\nvoid main()\n{\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    float inv = 1.-progress;\n    gl_FragColor = inv*blur(from, p, progress*0.6) + progress*blur(to, p, inv*0.6);\n}",
    "dissolve": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nconst float blocksize = 1.0;\nfloat rand(vec2 co) {\n    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);\n}\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    gl_FragColor = mix(texture2D(from, p), texture2D(to, p), step(rand(floor(gl_FragCoord.xy/blocksize)), progress));\n}",
    "doomScreenTransition": "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nfloat rand(int num) {\n    return fract(mod(float(num) * 67123.313, 12.0) * sin(float(num) * 10.3) * cos(float(num)));\n}\nfloat wave(int num) {\n    float fn = float(num) * 1.0 * 0.1 * float(10.0);\n    return cos(fn * 0.5) * cos(fn * 0.13) * sin((fn+10.0) * 0.3) / 2.0 + 0.5;\n}\nfloat pos(int num) {\n    return wave(num);\n}\nvoid main() {\n    int bar = int(gl_FragCoord.x) / 10;\n    float scale = 1.0 + pos(bar) * 2.0;\n    float phase = progress * scale;\n    float posY = gl_FragCoord.y / resolution.y;\n    vec2 p;\n    vec4 c;\n    if (phase + posY < 1.0) {\n        p = vec2(gl_FragCoord.x, gl_FragCoord.y + mix(0.0, resolution.y, phase)) / resolution.xy;\n        c = texture2D(from, p);\n    } else {\n        p = gl_FragCoord.xy / resolution.xy;\n        c = texture2D(to, p);\n    }\n    gl_FragColor = c;\n}",
    "dreamy": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nvec2 offset(float progress, float x, float theta) {\n    float phase = progress*progress + progress + theta;\n    float shifty = 0.03*progress*cos(10.0*(progress+x));\n    return vec2(0, shifty);\n}\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    gl_FragColor = mix(texture2D(from, p + offset(progress, p.x, 0.0)), texture2D(to, p + offset(1.0-progress, p.x, 3.14)), progress);\n}",
    "dreamyZoom": "#ifdef GL_ES\nprecision mediump float;\n#endif\n#define DEG2RAD 0.03926990816987241548078304229099\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nvoid main() {\n    float phase = progress < 0.5 ? progress * 2.0 : (progress - 0.5) * 2.0;\n    float angleOffset = progress < 0.5 ? mix(0.0, 6.0 * DEG2RAD, phase) : mix(-6.0 * DEG2RAD, 0.0, phase);\n    float newScale = progress < 0.5 ? mix(1.0, 1.2, phase) : mix(1.2, 1.0, phase);\n    vec2 center = vec2(0, 0);\n    float maxRes = max(resolution.x, resolution.y);\n    float resX = resolution.x / maxRes * 0.5;\n    float resY = resolution.y / maxRes * 0.5;\n    vec2 p = (gl_FragCoord.xy / maxRes - vec2(resX, resY)) / newScale;\n    float angle = atan(p.y, p.x) + angleOffset;\n    float dist = distance(center, p);\n    p.x = cos(angle) * dist + resX;\n    p.y = sin(angle) * dist + resY;\n    vec4 c = progress < 0.5 ? texture2D(from, p) : texture2D(to, p);\n    gl_FragColor = c + (progress < 0.5 ? mix(0.0, 1.0, phase) : mix(1.0, 0.0, phase));\n}",
    "fadeColorBlack": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from;\nuniform sampler2D to;\nuniform float progress;\nuniform vec2 resolution;\nconst vec3 color = vec3(0.0, 0.0, 0.0);\nconst float colorPhase = 0.4;\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    gl_FragColor = mix(\n        mix(vec4(color, 1.0), texture2D(from, p), smoothstep(1.0-colorPhase, 0.0, progress)),\n        mix(vec4(color, 1.0), texture2D(to,   p), smoothstep(    colorPhase, 1.0, progress)),\n        progress);\n    gl_FragColor.a = mix(texture2D(from, p).a, texture2D(to, p).a, progress);\n}",
    "fadeGrayscale": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from;\nuniform sampler2D to;\nuniform float progress;\nuniform vec2 resolution;\nconst float grayPhase = 0.3;\nvec3 grayscale (vec3 color) {\n    return vec3(0.2126*color.r + 0.7152*color.g + 0.0722*color.b);\n}\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec4 fc = texture2D(from, p);\n    vec4 tc = texture2D(to, p);\n    gl_FragColor = mix(\n        mix(vec4(grayscale(fc.rgb), 1.0), texture2D(from, p), smoothstep(1.0-grayPhase, 0.0, progress)),\n        mix(vec4(grayscale(tc.rgb), 1.0), texture2D(to,   p), smoothstep(    grayPhase, 1.0, progress)),\n        progress);\n    gl_FragColor.a = mix(fc.a, tc.a, progress);\n}",
    "flyEye": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from;\nuniform sampler2D to;\nuniform float progress;\nuniform vec2 resolution;\nconst float size = 0.04;\nconst float zoom = 30.0;\nconst float colorSeparation = 0.3;\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    float inv = 1. - progress;\n    vec2 disp = size*vec2(cos(zoom*p.x), sin(zoom*p.y));\n    vec4 texTo = texture2D(to, p + inv*disp);\n    vec4 texFrom = vec4(\n        texture2D(from, p + progress*disp*(1.0 - colorSeparation)).r,\n        texture2D(from, p + progress*disp).g,\n        texture2D(from, p + progress*disp*(1.0 + colorSeparation)).b,\n        texture2D(from, p + progress*disp).a);\n    gl_FragColor = texTo*progress + texFrom*inv;\n}",
    "glitchDisplace": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nmediump float random(vec2 co)\n{\n    mediump float a = 12.9898;\n    mediump float b = 78.233;\n    mediump float c = 43758.5453;\n    mediump float dt= dot(co.xy ,vec2(a,b));\n    mediump float sn= mod(dt,3.14);\n    return fract(sin(sn) * c);\n}\nfloat voronoi( in vec2 x ) {\n    vec2 p = floor( x );\n    vec2 f = fract( x );\n    float res = 8.0;\n    for( float j=-1.; j<=1.; j++ )\n    for( float i=-1.; i<=1.; i++ ) {\n        vec2  b = vec2( i, j );\n        vec2  r = b - f + random( p + b );\n        float d = dot( r, r );\n        res = min( res, d );\n    }\n    return sqrt( res );\n}\nvec2 displace(vec4 tex, vec2 texCoord, float dotDepth, float textureDepth, float strength) {\n    float b = voronoi(.003 * texCoord + 2.0);\n    float g = voronoi(0.2 * texCoord);\n    float r = voronoi(texCoord - 1.0);\n    vec4 dt = tex * 1.0;\n    vec4 dis = dt * dotDepth + 1.0 - tex * textureDepth;\n    dis.x = dis.x - 1.0 + textureDepth*dotDepth;\n    dis.y = dis.y - 1.0 + textureDepth*dotDepth;\n    dis.x *= strength;\n    dis.y *= strength;\n    vec2 res_uv = texCoord ;\n    res_uv.x = res_uv.x + dis.x - 0.0;\n    res_uv.y = res_uv.y + dis.y;\n    return res_uv;\n}\nfloat ease1(float t) {\n    return t == 0.0 || t == 1.0\n        ? t\n        : t < 0.5\n        ? +0.5 * pow(2.0, (20.0 * t) - 10.0)\n        : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;\n}\nfloat ease2(float t) {\n    return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);\n}\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec4 color1 = texture2D(from, p);\n    vec4 color2 = texture2D(to, p);\n    vec2 disp = displace(color1, p, 0.33, 0.7, 1.0-ease1(progress));\n    vec2 disp2 = displace(color2, p, 0.33, 0.5, ease2(progress));\n    vec4 dColor1 = texture2D(to, disp);\n    vec4 dColor2 = texture2D(from, disp2);\n    float val = ease1(progress);\n    vec3 gray = vec3(dot(min(dColor2, dColor1).rgb, vec3(0.299, 0.587, 0.114)));\n    dColor2 = vec4(gray, 1.0);\n    dColor2 *= 2.0;\n    color1 = mix(color1, dColor2, smoothstep(0.0, 0.5, progress));\n    color2 = mix(color2, dColor1, smoothstep(1.0, 0.5, progress));\n    gl_FragColor = mix(color1, color2, val);\n}",
    "kaleidoScope": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec2 q = p;\n    float t = pow(progress, 2.0)*1.0;\n    p = p -0.5;\n    for (int i = 0; i < 7; i++) {\n        p = vec2(sin(t)*p.x + cos(t)*p.y, sin(t)*p.y - cos(t)*p.x);\n        t += 2.0;\n        p = abs(mod(p, 2.0) - 1.0);\n    }\n    abs(mod(p, 1.0));\n    gl_FragColor = mix(\n        mix(texture2D(from, q), texture2D(to, q), progress),\n        mix(texture2D(from, p), texture2D(to, p), progress), 1.0 - 2.0*abs(progress - 0.5));\n}",
    "linearBlur": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nconst float intensity = 0.1;\nconst int PASSES = 8;\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec4 c1 = vec4(0.0), c2 = vec4(0.0);\n    float disp = intensity*(0.5-distance(0.5, progress));\n    for (int xi=0; xi<PASSES; ++xi) {\n        float x = float(xi) / float(PASSES) - 0.5;\n        for (int yi=0; yi<PASSES; ++yi) {\n            float y = float(yi) / float(PASSES) - 0.5;\n            vec2 v = vec2(x,y);\n            float d = disp;\n            c1 += texture2D(from, p + d*v);\n            c2 += texture2D(to, p + d*v);\n        }\n    }\n    c1 /= float(PASSES*PASSES);\n    c2 /= float(PASSES*PASSES);\n    gl_FragColor = mix(c1, c2, progress);\n}",
    "morph": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nconst float strength=0.1;\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec4 ca = texture2D(from, p);\n    vec4 cb = texture2D(to, p);\n    vec2 oa = (((ca.rg+ca.b)*0.5)*2.0-1.0);\n    vec2 ob = (((cb.rg+cb.b)*0.5)*2.0-1.0);\n    vec2 oc = mix(oa,ob,0.5)*strength;\n    float w0 = progress;\n    float w1 = 1.0-w0;\n    gl_FragColor = mix(texture2D(from, p+oc*w0), texture2D(to, p-oc*w1), progress);\n}",
    "polkaDots": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nconst float dots = 5.0;\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    float x = progress;\n    bool nextImage = distance(fract(p * dots), vec2(0.5, 0.5)) < x;\n    if(nextImage)\n        gl_FragColor = texture2D(to, p);\n    else\n        gl_FragColor = texture2D(from, p);\n}",
    "polkaDotsCurtain": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nconst float SQRT_2 = 1.414213562373;\nconst float dots = 20.0;\nconst vec2 center = vec2(1.0, 1.0);\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    float x = progress /2.0;\n    bool nextImage = distance(fract(p * dots), vec2(0.5, 0.5)) < (2.0 * x / distance(p, center));\n    if(nextImage) gl_FragColor = texture2D(to, p);\n    else gl_FragColor = texture2D(from, p);\n}",
    "radial": "#ifdef GL_ES\nprecision mediump float;\n#endif\n#define PI 3.141592653589\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec2 rp = p*2.-1.;\n    float a = atan(rp.y, rp.x);\n    float pa = progress*PI*2.5-PI*1.25;\n    vec4 fromc = texture2D(from, p);\n    vec4 toc = texture2D(to, p);\n    if(a>pa) {\n        gl_FragColor = mix(toc, fromc, smoothstep(0., 1., (a-pa)));\n    } else {\n        gl_FragColor = toc;\n    }\n}",
    "randomSquares": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nfloat rand(vec2 co){\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\nvoid main() {\n    float revProgress = (1.0 - progress);\n    float distFromEdges = min(progress, revProgress);\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec4 fromColor = texture2D(from, p);\n    vec4 toColor = texture2D(to, p);\n    float squareSize = 20.0;\n    float flickerSpeed = 60.0;\n    vec2 seed = floor(gl_FragCoord.xy / squareSize) * floor(distFromEdges * flickerSpeed);\n    gl_FragColor = mix(fromColor, toColor, progress) + rand(seed) * distFromEdges * 0.5;\n}",
    "randomSquares2": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from;\nuniform sampler2D to;\nuniform float progress;\nuniform vec2 resolution;\nconst ivec2 size = ivec2(10.0, 10.0);\nconst float smoothness = 0.5;\nfloat rand (vec2 co) {\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    float r = rand(floor(vec2(size) * p));\n    float m = smoothstep(0.0, -smoothness, r - (progress * (1.0 + smoothness)));\n    gl_FragColor = mix(texture2D(from, p), texture2D(to, p), m);\n}",
    "ripple": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from;\nuniform sampler2D to;\nuniform float progress;\nuniform vec2 resolution;\nconst float amplitude = 100.0;\nconst float speed = 50.0;\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec2 dir = p - vec2(.5);\n    float dist = length(dir);\n    vec2 offset = dir * (sin(progress * dist * amplitude - progress * speed) + .5) / 30.;\n    gl_FragColor = mix(texture2D(from, p + offset), texture2D(to, p), smoothstep(0.2, 1.0, progress));\n}",
    "squareSwipe": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nconst ivec2 squares = ivec2(10.0, 10.0);\nconst vec2 direction = vec2(1.0, -0.5);\nconst float smoothness = 1.6;\nconst vec2 center = vec2(0.5, 0.5);\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    vec2 v = normalize(direction);\n    if (v != vec2(0.0))\n        v /= abs(v.x)+abs(v.y);\n    float d = v.x * center.x + v.y * center.y;\n    float offset = smoothness;\n    float pr = smoothstep(-offset, 0.0, v.x * p.x + v.y * p.y - (d-0.5+progress*(1.+offset)));\n    vec2 squarep = fract(p*vec2(squares));\n    vec2 squaremin = vec2(pr/2.0);\n    vec2 squaremax = vec2(1.0 - pr/2.0);\n    float a = all(lessThan(squaremin, squarep)) && all(lessThan(squarep, squaremax)) ? 1.0 : 0.0;\n    gl_FragColor = mix(texture2D(from, p), texture2D(to, p), a);\n}",
    "squeeze": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from;\nuniform sampler2D to;\nuniform float progress;\nuniform vec2 resolution;\nconst float colorSeparation = 0.02;\nfloat progressY (float y) {\n    return 0.5 + (y-0.5) / (1.0-progress);\n}\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    float y = progressY(p.y);\n    if (y < 0.0 || y > 1.0) {\n        gl_FragColor = texture2D(to, p);\n    }\n    else {\n        vec2 fp = vec2(p.x, y) + progress*vec2(0.0, colorSeparation);\n        vec4 c = vec4(\n            texture2D(from, fp).r,\n            texture2D(from, fp).g,\n            texture2D(from, fp).b,\n            texture2D(from, fp).a\n            );\n        gl_FragColor = c;\n        if (c.a == 0.0) {gl_FragColor = texture2D(to, p);}\n    }\n}",
    "wind": "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D from;\nuniform sampler2D to;\nuniform float progress;\nuniform vec2 resolution;\nconst float size = 0.2;\nfloat rand (vec2 co) {\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\nvoid main() {\n    vec2 p = gl_FragCoord.xy / resolution.xy;\n    float r = rand(vec2(0, p.y));\n    float m = smoothstep(0.0, -size, p.x*(1.0-size) + size*r - (progress * (1.0 + size)));\n    gl_FragColor = mix(texture2D(from, p), texture2D(to, p), m);\n}"
});});