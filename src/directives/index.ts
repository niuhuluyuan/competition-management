import { Directive } from 'vue'

function throttle(fn: Function, wait: number) {
  let previous = 0
  return function () {
      let now = Date.now()
      // this指向依然指向原来的函数
      let context = this
      let args = [...arguments]
      if (now - previous > wait) {
          // 修改this指向
          fn.apply(context, args)
          // 修改时间为当前时间
          previous = now
      }
    }
  }

const eee = ($event: Event) => {
  // 阻止事件冒泡
  $event.stopPropagation()
  
  const { scrollTop, clientHeight, scrollHeight } = $event.target as HTMLElement

  // todo 触底往上滚的时候有触发 closure

  if (Math.abs((scrollTop + clientHeight) - scrollHeight) < 2) {
    console.log('到底了')
  }
}

const scrollToBottom: Directive = {
  mounted(el, binding) {
    el.addEventListener('scroll', throttle(eee, 100))
  },

  unmounted(el) {
    // 卸载时取消监听器，避免影响性能
    el.removeEventListener('scroll')
  }
}

export { scrollToBottom }
