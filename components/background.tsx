"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function Background() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 30

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  mountRef.current?.appendChild(renderer.domElement)

  // 🔥 Create soft circular gradient texture (gaussian-like)
  const size = 128
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  )

  gradient.addColorStop(0, "rgba(255,255,255,1)")
  gradient.addColorStop(0.2, "rgba(255,255,255,0.8)")
  gradient.addColorStop(0.4, "rgba(255,255,255,0.4)")
  gradient.addColorStop(1, "rgba(255,255,255,0)")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)

  // 🌈 Particles
  const count = 100
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const color = new THREE.Color()

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    positions[i3] = (Math.random() - 0.5) * 300
    positions[i3 + 1] = (Math.random() - 0.5) * 300
    positions[i3 + 2] = (Math.random() - 0.5) * 300

    // neon HSL
    color.setHSL(Math.random(), 1, 0.6)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 20,
    map: texture,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const splats = new THREE.Points(geometry, material)
  scene.add(splats)
 // ✨ Cinematic shooting stars
const stars: THREE.Mesh[] = []

function spawnStar() {
  const length = 40
  const geometry = new THREE.PlaneGeometry(length, 1)

  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color().setHSL(Math.random(), 1, 0.7),
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const star = new THREE.Mesh(geometry, material)

  // random diagonal direction
  const angle = Math.random() * Math.PI * 2
  const direction = new THREE.Vector3(
    Math.cos(angle),
    Math.sin(angle),
    0
  ).normalize()

  // start outside screen bounds
  const distance = 200
  star.position.set(
    -direction.x * distance,
    -direction.y * distance,
    (Math.random() - 0.5) * 50
  )

  star.rotation.z = angle

  ;(star as any).velocity = direction.multiplyScalar(80)

  scene.add(star)
  stars.push(star)
}

  // Smooth scroll
  let targetY = 0
  let currentY = 0

  const handleScroll = () => {
    targetY = -window.scrollY * 0.02
  }

  window.addEventListener("scroll", handleScroll)

  const clock = new THREE.Clock()

  function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()

  // smooth camera
  currentY += (targetY - currentY) * 0.05
  camera.position.y = currentY

  // slow splat rotation
  splats.rotation.y += 0.03 * delta
  splats.rotation.x += 0.01 * delta

  // rare spawn
if (Math.random() < 0.002) {
  spawnStar()
}

// move stars fully across scene
stars.forEach((star, index) => {
  const velocity = (star as any).velocity
  star.position.addScaledVector(velocity, delta)

  const mat = star.material as THREE.MeshBasicMaterial
  mat.opacity -= delta * 0.5

  // remove when far outside
  if (star.position.length() > 250 || mat.opacity <= 0) {
    scene.remove(star)
    stars.splice(index, 1)
  }
})

  renderer.render(scene, camera)
}

  animate()

  return () => {
    window.removeEventListener("scroll", handleScroll)
    renderer.dispose()
  }
}, [])

  return <div className="fixed inset-0 -z-10" ref={mountRef} />
}
