let PBF;
! function(t) {
  if ("object" == typeof exports && "undefined" != typeof module) PBF = module.exports = t();
  else if ("function" == typeof define && define.amd) define([], t);
  else {
    var i;
    i = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, i.Pbf = t()
  }
}(function() {
  return function t(i, e, r) {
    function s(o, h) {
      if (!e[o]) {
        if (!i[o]) {
          var a = "function" == typeof require && require;
          if (!h && a) return a(o, !0);
          if (n) return n(o, !0);
          var u = new Error("Cannot find module '" + o + "'");
          throw u.code = "MODULE_NOT_FOUND", u
        }
        var f = e[o] = {
          exports: {}
        };
        i[o][0].call(f.exports, function(t) {
          var e = i[o][1][t];
          return s(e ? e : t)
        }, f, f.exports, t, i, e, r)
      }
      return e[o].exports
    }
    for (var n = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
    return s
  }({
    1: [function(t, i, e) {
      "use strict";

      function r(t) {
        this.buf = ArrayBuffer.isView && ArrayBuffer.isView(t) ? t : new Uint8Array(t || 0), this.pos = 0, this.type = 0, this.length = this.buf.length
      }

      function s(t, i, e) {
        var r, s, n = e.buf;
        if (s = n[e.pos++], r = (112 & s) >> 4, s < 128) return o(t, r, i);
        if (s = n[e.pos++], r |= (127 & s) << 3, s < 128) return o(t, r, i);
        if (s = n[e.pos++], r |= (127 & s) << 10, s < 128) return o(t, r, i);
        if (s = n[e.pos++], r |= (127 & s) << 17, s < 128) return o(t, r, i);
        if (s = n[e.pos++], r |= (127 & s) << 24, s < 128) return o(t, r, i);
        if (s = n[e.pos++], r |= (1 & s) << 31, s < 128) return o(t, r, i);
        throw new Error("Expected varint not more than 10 bytes")
      }

      function n(t) {
        return t.type === r.Bytes ? t.readVarint() + t.pos : t.pos + 1
      }

      function o(t, i, e) {
        return e ? 4294967296 * i + (t >>> 0) : 4294967296 * (i >>> 0) + (t >>> 0)
      }

      function h(t, i) {
        var e, r;
        if (t >= 0 ? (e = t % 4294967296 | 0, r = t / 4294967296 | 0) : (e = ~(-t % 4294967296), r = ~(-t / 4294967296), 4294967295 ^ e ? e = e + 1 | 0 : (e = 0, r = r + 1 | 0)), t >= 0x10000000000000000 || t < -0x10000000000000000) throw new Error("Given varint doesn't fit into 10 bytes");
        i.realloc(10), a(e, r, i), u(r, i)
      }

      function a(t, i, e) {
        e.buf[e.pos++] = 127 & t | 128, t >>>= 7, e.buf[e.pos++] = 127 & t | 128, t >>>= 7, e.buf[e.pos++] = 127 & t | 128, t >>>= 7, e.buf[e.pos++] = 127 & t | 128, t >>>= 7, e.buf[e.pos] = 127 & t
      }

      function u(t, i) {
        var e = (7 & t) << 4;
        i.buf[i.pos++] |= e | ((t >>>= 3) ? 128 : 0), t && (i.buf[i.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), t && (i.buf[i.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), t && (i.buf[i.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), t && (i.buf[i.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), t && (i.buf[i.pos++] = 127 & t)))))
      }

      function f(t, i, e) {
        var r = i <= 16383 ? 1 : i <= 2097151 ? 2 : i <= 268435455 ? 3 : Math.ceil(Math.log(i) / (7 * Math.LN2));
        e.realloc(r);
        for (var s = e.pos - 1; s >= t; s--) e.buf[s + r] = e.buf[s]
      }

      function d(t, i) {
        for (var e = 0; e < t.length; e++) i.writeVarint(t[e])
      }

      function p(t, i) {
        for (var e = 0; e < t.length; e++) i.writeSVarint(t[e])
      }

      function c(t, i) {
        for (var e = 0; e < t.length; e++) i.writeFloat(t[e])
      }

      function l(t, i) {
        for (var e = 0; e < t.length; e++) i.writeDouble(t[e])
      }

      function w(t, i) {
        for (var e = 0; e < t.length; e++) i.writeBoolean(t[e])
      }

      function F(t, i) {
        for (var e = 0; e < t.length; e++) i.writeFixed32(t[e])
      }

      function b(t, i) {
        for (var e = 0; e < t.length; e++) i.writeSFixed32(t[e])
      }

      function v(t, i) {
        for (var e = 0; e < t.length; e++) i.writeFixed64(t[e])
      }

      function g(t, i) {
        for (var e = 0; e < t.length; e++) i.writeSFixed64(t[e])
      }

      function x(t, i) {
        return (t[i] | t[i + 1] << 8 | t[i + 2] << 16) + 16777216 * t[i + 3]
      }

      function V(t, i, e) {
        t[e] = i, t[e + 1] = i >>> 8, t[e + 2] = i >>> 16, t[e + 3] = i >>> 24
      }

      function y(t, i) {
        return (t[i] | t[i + 1] << 8 | t[i + 2] << 16) + (t[i + 3] << 24)
      }

      function M(t, i, e) {
        for (var r = "", s = i; s < e;) {
          var n = t[s],
            o = null,
            h = n > 239 ? 4 : n > 223 ? 3 : n > 191 ? 2 : 1;
          if (s + h > e) break;
          var a, u, f;
          1 === h ? n < 128 && (o = n) : 2 === h ? (a = t[s + 1], 128 === (192 & a) && (o = (31 & n) << 6 | 63 & a, o <= 127 && (o = null))) : 3 === h ? (a = t[s + 1], u = t[s + 2], 128 === (192 & a) && 128 === (192 & u) && (o = (15 & n) << 12 | (63 & a) << 6 | 63 & u, (o <= 2047 || o >= 55296 && o <= 57343) && (o = null))) : 4 === h && (a = t[s + 1], u = t[s + 2], f = t[s + 3], 128 === (192 & a) && 128 === (192 & u) && 128 === (192 & f) && (o = (15 & n) << 18 | (63 & a) << 12 | (63 & u) << 6 | 63 & f, (o <= 65535 || o >= 1114112) && (o = null))), null === o ? (o = 65533, h = 1) : o > 65535 && (o -= 65536, r += String.fromCharCode(o >>> 10 & 1023 | 55296), o = 56320 | 1023 & o), r += String.fromCharCode(o), s += h
        }
        return r
      }

      function S(t, i, e) {
        for (var r, s, n = 0; n < i.length; n++) {
          if (r = i.charCodeAt(n), r > 55295 && r < 57344) {
            if (!s) {
              r > 56319 || n + 1 === i.length ? (t[e++] = 239, t[e++] = 191, t[e++] = 189) : s = r;
              continue
            }
            if (r < 56320) {
              t[e++] = 239, t[e++] = 191, t[e++] = 189, s = r;
              continue
            }
            r = s - 55296 << 10 | r - 56320 | 65536, s = null
          } else s && (t[e++] = 239, t[e++] = 191, t[e++] = 189, s = null);
          r < 128 ? t[e++] = r : (r < 2048 ? t[e++] = r >> 6 | 192 : (r < 65536 ? t[e++] = r >> 12 | 224 : (t[e++] = r >> 18 | 240, t[e++] = r >> 12 & 63 | 128), t[e++] = r >> 6 & 63 | 128), t[e++] = 63 & r | 128)
        }
        return e
      }
      i.exports = r;
      var B = t("ieee754");
      r.Varint = 0, r.Fixed64 = 1, r.Bytes = 2, r.Fixed32 = 5;
      var k = 4294967296,
        P = 1 / k;
      r.prototype = {
        destroy: function() {
          this.buf = null
        },
        readFields: function(t, i, e) {
          for (e = e || this.length; this.pos < e;) {
            var r = this.readVarint(),
              s = r >> 3,
              n = this.pos;
            this.type = 7 & r, t(s, i, this), this.pos === n && this.skip(r)
          }
          return i
        },
        readMessage: function(t, i) {
          return this.readFields(t, i, this.readVarint() + this.pos)
        },
        readFixed32: function() {
          var t = x(this.buf, this.pos);
          return this.pos += 4, t
        },
        readSFixed32: function() {
          var t = y(this.buf, this.pos);
          return this.pos += 4, t
        },
        readFixed64: function() {
          var t = x(this.buf, this.pos) + x(this.buf, this.pos + 4) * k;
          return this.pos += 8, t
        },
        readSFixed64: function() {
          var t = x(this.buf, this.pos) + y(this.buf, this.pos + 4) * k;
          return this.pos += 8, t
        },
        readFloat: function() {
          var t = B.read(this.buf, this.pos, !0, 23, 4);
          return this.pos += 4, t
        },
        readDouble: function() {
          var t = B.read(this.buf, this.pos, !0, 52, 8);
          return this.pos += 8, t
        },
        readVarint: function(t) {
          var i, e, r = this.buf;
          return e = r[this.pos++], i = 127 & e, e < 128 ? i : (e = r[this.pos++], i |= (127 & e) << 7, e < 128 ? i : (e = r[this.pos++], i |= (127 & e) << 14, e < 128 ? i : (e = r[this.pos++], i |= (127 & e) << 21, e < 128 ? i : (e = r[this.pos], i |= (15 & e) << 28, s(i, t, this)))))
        },
        readVarint64: function() {
          return this.readVarint(!0)
        },
        readSVarint: function() {
          var t = this.readVarint();
          return t % 2 === 1 ? (t + 1) / -2 : t / 2
        },
        readBoolean: function() {
          return Boolean(this.readVarint())
        },
        readString: function() {
          var t = this.readVarint() + this.pos,
            i = M(this.buf, this.pos, t);
          return this.pos = t, i
        },
        readBytes: function() {
          var t = this.readVarint() + this.pos,
            i = this.buf.subarray(this.pos, t);
          return this.pos = t, i
        },
        readPackedVarint: function(t, i) {
          var e = n(this);
          for (t = t || []; this.pos < e;) t.push(this.readVarint(i));
          return t
        },
        readPackedSVarint: function(t) {
          var i = n(this);
          for (t = t || []; this.pos < i;) t.push(this.readSVarint());
          return t
        },
        readPackedBoolean: function(t) {
          var i = n(this);
          for (t = t || []; this.pos < i;) t.push(this.readBoolean());
          return t
        },
        readPackedFloat: function(t) {
          var i = n(this);
          for (t = t || []; this.pos < i;) t.push(this.readFloat());
          return t
        },
        readPackedDouble: function(t) {
          var i = n(this);
          for (t = t || []; this.pos < i;) t.push(this.readDouble());
          return t
        },
        readPackedFixed32: function(t) {
          var i = n(this);
          for (t = t || []; this.pos < i;) t.push(this.readFixed32());
          return t
        },
        readPackedSFixed32: function(t) {
          var i = n(this);
          for (t = t || []; this.pos < i;) t.push(this.readSFixed32());
          return t
        },
        readPackedFixed64: function(t) {
          var i = n(this);
          for (t = t || []; this.pos < i;) t.push(this.readFixed64());
          return t
        },
        readPackedSFixed64: function(t) {
          var i = n(this);
          for (t = t || []; this.pos < i;) t.push(this.readSFixed64());
          return t
        },
        skip: function(t) {
          var i = 7 & t;
          if (i === r.Varint)
            for (; this.buf[this.pos++] > 127;);
          else if (i === r.Bytes) this.pos = this.readVarint() + this.pos;
          else if (i === r.Fixed32) this.pos += 4;
          else {
            if (i !== r.Fixed64) throw new Error("Unimplemented type: " + i);
            this.pos += 8
          }
        },
        writeTag: function(t, i) {
          this.writeVarint(t << 3 | i)
        },
        realloc: function(t) {
          for (var i = this.length || 16; i < this.pos + t;) i *= 2;
          if (i !== this.length) {
            var e = new Uint8Array(i);
            e.set(this.buf), this.buf = e, this.length = i
          }
        },
        finish: function() {
          return this.length = this.pos, this.pos = 0, this.buf.subarray(0, this.length)
        },
        writeFixed32: function(t) {
          this.realloc(4), V(this.buf, t, this.pos), this.pos += 4
        },
        writeSFixed32: function(t) {
          this.realloc(4), V(this.buf, t, this.pos), this.pos += 4
        },
        writeFixed64: function(t) {
          this.realloc(8), V(this.buf, t & -1, this.pos), V(this.buf, Math.floor(t * P), this.pos + 4), this.pos += 8
        },
        writeSFixed64: function(t) {
          this.realloc(8), V(this.buf, t & -1, this.pos), V(this.buf, Math.floor(t * P), this.pos + 4), this.pos += 8
        },
        writeVarint: function(t) {
          return t = +t || 0, t > 268435455 || t < 0 ? void h(t, this) : (this.realloc(4), this.buf[this.pos++] = 127 & t | (t > 127 ? 128 : 0), void(t <= 127 || (this.buf[this.pos++] = 127 & (t >>>= 7) | (t > 127 ? 128 : 0), t <= 127 || (this.buf[this.pos++] = 127 & (t >>>= 7) | (t > 127 ? 128 : 0), t <= 127 || (this.buf[this.pos++] = t >>> 7 & 127)))))
        },
        writeSVarint: function(t) {
          this.writeVarint(t < 0 ? 2 * -t - 1 : 2 * t)
        },
        writeBoolean: function(t) {
          this.writeVarint(Boolean(t))
        },
        writeString: function(t) {
          t = String(t), this.realloc(4 * t.length), this.pos++;
          var i = this.pos;
          this.pos = S(this.buf, t, this.pos);
          var e = this.pos - i;
          e >= 128 && f(i, e, this), this.pos = i - 1, this.writeVarint(e), this.pos += e
        },
        writeFloat: function(t) {
          this.realloc(4), B.write(this.buf, t, this.pos, !0, 23, 4), this.pos += 4
        },
        writeDouble: function(t) {
          this.realloc(8), B.write(this.buf, t, this.pos, !0, 52, 8), this.pos += 8
        },
        writeBytes: function(t) {
          var i = t.length;
          this.writeVarint(i), this.realloc(i);
          for (var e = 0; e < i; e++) this.buf[this.pos++] = t[e]
        },
        writeRawMessage: function(t, i) {
          this.pos++;
          var e = this.pos;
          t(i, this);
          var r = this.pos - e;
          r >= 128 && f(e, r, this), this.pos = e - 1, this.writeVarint(r), this.pos += r
        },
        writeMessage: function(t, i, e) {
          this.writeTag(t, r.Bytes), this.writeRawMessage(i, e)
        },
        writePackedVarint: function(t, i) {
          this.writeMessage(t, d, i)
        },
        writePackedSVarint: function(t, i) {
          this.writeMessage(t, p, i)
        },
        writePackedBoolean: function(t, i) {
          this.writeMessage(t, w, i)
        },
        writePackedFloat: function(t, i) {
          this.writeMessage(t, c, i)
        },
        writePackedDouble: function(t, i) {
          this.writeMessage(t, l, i)
        },
        writePackedFixed32: function(t, i) {
          this.writeMessage(t, F, i)
        },
        writePackedSFixed32: function(t, i) {
          this.writeMessage(t, b, i)
        },
        writePackedFixed64: function(t, i) {
          this.writeMessage(t, v, i)
        },
        writePackedSFixed64: function(t, i) {
          this.writeMessage(t, g, i)
        },
        writeBytesField: function(t, i) {
          this.writeTag(t, r.Bytes), this.writeBytes(i)
        },
        writeFixed32Field: function(t, i) {
          this.writeTag(t, r.Fixed32), this.writeFixed32(i)
        },
        writeSFixed32Field: function(t, i) {
          this.writeTag(t, r.Fixed32), this.writeSFixed32(i)
        },
        writeFixed64Field: function(t, i) {
          this.writeTag(t, r.Fixed64), this.writeFixed64(i)
        },
        writeSFixed64Field: function(t, i) {
          this.writeTag(t, r.Fixed64), this.writeSFixed64(i)
        },
        writeVarintField: function(t, i) {
          this.writeTag(t, r.Varint), this.writeVarint(i)
        },
        writeSVarintField: function(t, i) {
          this.writeTag(t, r.Varint), this.writeSVarint(i)
        },
        writeStringField: function(t, i) {
          this.writeTag(t, r.Bytes), this.writeString(i)
        },
        writeFloatField: function(t, i) {
          this.writeTag(t, r.Fixed32), this.writeFloat(i)
        },
        writeDoubleField: function(t, i) {
          this.writeTag(t, r.Fixed64), this.writeDouble(i)
        },
        writeBooleanField: function(t, i) {
          this.writeVarintField(t, Boolean(i))
        }
      }
    }, {
      ieee754: 2
    }],
    2: [function(t, i, e) {
      e.read = function(t, i, e, r, s) {
        var n, o, h = 8 * s - r - 1,
          a = (1 << h) - 1,
          u = a >> 1,
          f = -7,
          d = e ? s - 1 : 0,
          p = e ? -1 : 1,
          c = t[i + d];
        for (d += p, n = c & (1 << -f) - 1, c >>= -f, f += h; f > 0; n = 256 * n + t[i + d], d += p, f -= 8);
        for (o = n & (1 << -f) - 1, n >>= -f, f += r; f > 0; o = 256 * o + t[i + d], d += p, f -= 8);
        if (0 === n) n = 1 - u;
        else {
          if (n === a) return o ? NaN : (c ? -1 : 1) * (1 / 0);
          o += Math.pow(2, r), n -= u
        }
        return (c ? -1 : 1) * o * Math.pow(2, n - r)
      }, e.write = function(t, i, e, r, s, n) {
        var o, h, a, u = 8 * n - s - 1,
          f = (1 << u) - 1,
          d = f >> 1,
          p = 23 === s ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
          c = r ? 0 : n - 1,
          l = r ? 1 : -1,
          w = i < 0 || 0 === i && 1 / i < 0 ? 1 : 0;
        for (i = Math.abs(i), isNaN(i) || i === 1 / 0 ? (h = isNaN(i) ? 1 : 0, o = f) : (o = Math.floor(Math.log(i) / Math.LN2), i * (a = Math.pow(2, -o)) < 1 && (o--, a *= 2), i += o + d >= 1 ? p / a : p * Math.pow(2, 1 - d), i * a >= 2 && (o++, a /= 2), o + d >= f ? (h = 0, o = f) : o + d >= 1 ? (h = (i * a - 1) * Math.pow(2, s), o += d) : (h = i * Math.pow(2, d - 1) * Math.pow(2, s), o = 0)); s >= 8; t[e + c] = 255 & h, c += l, h /= 256, s -= 8);
        for (o = o << s | h, u += s; u > 0; t[e + c] = 255 & o, c += l, o /= 256, u -= 8);
        t[e + c - l] |= 128 * w
      }
    }, {}]
  }, {}, [1])(1)
});
export default PBF;
