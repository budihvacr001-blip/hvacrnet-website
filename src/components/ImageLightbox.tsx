import { useCallback, useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageLightboxProps {
  open: boolean
  images: string[]
  initialIndex: number
  alt?: string
  onClose: () => void
}

const MIN_SCALE = 1
const MAX_SCALE = 8
const SWIPE_THRESHOLD = 50

export default function ImageLightbox({ open, images, initialIndex, alt, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 维护跨事件的瞬时手势状态
  const gesture = useRef({
    dragging: false,
    moved: false,
    touches: [] as React.Touch[],
    pinchDist: 0,
    baseScale: 1,
    startOffset: { x: 0, y: 0 },
    lastScale: 1,
    startPos: { x: 0, y: 0 },
    lastPos: { x: 0, y: 0 },
  })

  const total = images.length

  // 打开时重置并锁定背景滚动
  useEffect(() => {
    if (!open) return
    setIndex(initialIndex)
    setScale(1)
    setOffset({ x: 0, y: 0 })
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, initialIndex])

  const goTo = useCallback(
    (dir: number) => {
      if (total === 0) return
      setIndex((i) => (i + dir + total) % total)
      setScale(1)
      setOffset({ x: 0, y: 0 })
      gesture.current.lastScale = 1
      gesture.current.startOffset = { x: 0, y: 0 }
    },
    [total]
  )

  // 键盘控制
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' || e.key === 'a') goTo(-1)
      else if (e.key === 'ArrowRight' || e.key === 'd') goTo(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, goTo, onClose])

  if (!open) return null

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))

  const dist = (t: React.Touch[]) => {
    if (t.length < 2) return 0
    const dx = t[0].clientX - t[1].clientX
    const dy = t[0].clientY - t[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const settleOffset = (x: number, y: number) => {
    const el = containerRef.current
    if (!el) return { x, y }
    const w = el.clientWidth
    const h = el.clientHeight
    // 轻微限制拖动范围：图片不至于被完全拖出视野
    const limitX = w * scale * 0.75
    const limitY = h * scale * 0.75
    return { x: Math.max(-limitX, Math.min(limitX, x)), y: Math.max(-limitY, Math.min(limitY, y)) }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    const t = Array.from(e.touches)
    gesture.current.touches = t
    gesture.current.moved = false
    if (t.length === 2) {
      gesture.current.pinchDist = dist(t)
      gesture.current.baseScale = scale
      e.preventDefault()
    } else if (t.length === 1) {
      gesture.current.dragging = true
      gesture.current.startPos = { x: t[0].clientX, y: t[0].clientY }
      gesture.current.lastPos = { x: t[0].clientX, y: t[0].clientY }
      gesture.current.startOffset = offset
      setDragging(true)
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const t = Array.from(e.touches)
    const g = gesture.current
    // 双指：捏合缩放
    if (t.length === 2 && g.pinchDist > 0) {
      const d = dist(t)
      const factor = d / g.pinchDist
      const next = clampScale(g.baseScale * factor)
      setScale(next)
      g.lastScale = next
      g.moved = true
      e.preventDefault()
      return
    }
    // 单指：拖动平移
    if (t.length === 1 && g.dragging) {
      const dx = t[0].clientX - g.lastPos.x
      const dy = t[0].clientY - g.lastPos.y
      g.lastPos = { x: t[0].clientX, y: t[0].clientY }
      const moved = Math.abs(t[0].clientX - g.startPos.x) + Math.abs(t[0].clientY - g.startPos.y)
      if (moved > 6) g.moved = true
      setOffset((o) => settleOffset(o.x + dx, o.y + dy))
    }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const g = gesture.current
    const remaining = Array.from(e.touches)
    // 从双指变单指：可能继续拖动
    if (remaining.length === 1 && g.pinchDist > 0) {
      g.dragging = true
      g.pinchDist = 0
      g.startPos = { x: remaining[0].clientX, y: remaining[0].clientY }
      g.lastPos = { x: remaining[0].clientX, y: remaining[0].clientY }
      g.startOffset = offset
      setDragging(true)
      return
    }
    // 单指结束：判断是否滑动切图
    const isSwipe =
      g.dragging && !g.moved && scale <= 1
    if (isSwipe) {
      const dx = g.lastPos.x - g.startPos.x
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        goTo(dx < 0 ? 1 : -1)
      }
    }
    g.dragging = false
    g.pinchDist = 0
    setDragging(false)
  }

  // 桌面：滚轮缩放（以光标为中心）
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = e.clientX - rect.left - rect.width / 2
    const cy = e.clientY - rect.top - rect.height / 2
    const factor = e.deltaY < 0 ? 1.12 : 0.89
    const next = clampScale(scale * factor)
    const ratio = next / scale
    // 保持光标下的图像点固定
    const nx = cx - (cx - offset.x) * ratio
    const ny = cy - (cy - offset.y) * ratio
    const settled = settleOffset(nx, ny)
    setScale(next)
    setOffset(settled)
  }

  // 桌面：鼠标拖动
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    gesture.current.dragging = true
    gesture.current.startPos = { x: e.clientX, y: e.clientY }
    gesture.current.lastPos = { x: e.clientX, y: e.clientY }
    gesture.current.startOffset = offset
    gesture.current.moved = false
    setDragging(true)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!gesture.current.dragging) return
    const dx = e.clientX - gesture.current.lastPos.x
    const dy = e.clientY - gesture.current.lastPos.y
    gesture.current.lastPos = { x: e.clientX, y: e.clientY }
    if (Math.abs(e.clientX - gesture.current.startPos.x) + Math.abs(e.clientY - gesture.current.startPos.y) > 6) {
      gesture.current.moved = true
    }
    setOffset((o) => settleOffset(o.x + dx, o.y + dy))
  }

  const endDrag = () => {
    gesture.current.dragging = false
    setDragging(false)
  }

  const backdropClick = (e: React.MouseEvent) => {
    // 拖动后的 click 不触发关闭
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black/90"
      style={{ touchAction: 'none' }}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={backdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Close */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
        aria-label="Close image"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Counter */}
      {total > 0 && (
        <div className="absolute left-1/2 top-5 -translate-x-1/2 text-sm text-white/70">
          {index + 1} / {total}
        </div>
      )}

      {/* Prev arrow */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goTo(-1)
          }}
          className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      {/* Image */}
      <div
        className="flex h-full w-full select-none items-center justify-center"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        {images[index] ? (
          <img
            src={images[index]}
            alt={alt ? `${alt} ${index + 1}` : `Image ${index + 1}`}
            draggable={false}
            className="max-h-[94vh] max-w-[94vw] object-contain"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              cursor: dragging ? 'grabbing' : scale > 1 ? 'grab' : 'zoom-in',
              transition: dragging ? 'none' : 'transform 0.15s ease-out',
            }}
            onDoubleClick={() => {
              if (scale > 1) {
                setScale(1)
                setOffset({ x: 0, y: 0 })
              }
            }}
          />
        ) : (
          <p className="text-white/60">No image</p>
        )}
      </div>

      {/* Next arrow */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goTo(1)
          }}
          className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
          aria-label="Next image"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}
    </div>
  )
}