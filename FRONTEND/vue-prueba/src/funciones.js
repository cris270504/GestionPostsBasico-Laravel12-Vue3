import Swal from "sweetalert2"

/**
 * Alerta simple reutilizable
 * @param {string} mensaje
 * @param {'success'|'error'|'warning'|'info'|'question'} icono
 * @param {string} focoId  (opcional) id de elemento a enfocar
 */
export function showAlerta(mensaje, icono = 'info', focoId = '') {
  if (focoId) {
    const el = document.getElementById(focoId)
    if (el) el.focus()
  }
  Swal.fire({
    title: mensaje,
    icon: icono,
    customClass: {
      confirmButton: 'btn btn-primary',
      popup: 'animate__animated animate__zoomIn'
    },
    buttonsStyling: false
  })
}

export function showErroresDeValidacion(errors){
  if (errors) {
    const lista = Object.entries(errors).flatMap(([k, arr]) => arr.map(m => `${k}: ${m}`))
    showAlerta(lista.join('\n'), 'error')
  } else {
    showAlerta(e?.response?.data?.message || e?.message || 'No se pudo crear', 'error')
  }
}

/**
 * Confirmación genérica. NO elimina nada por sí sola.
 * Devuelve true si el usuario confirma.
 * @param {{
 *  titulo?: string,
 *  texto?: string,
 *  icono?: 'question'|'warning'|'info'|'error'|'success',
 *  confirmarTexto?: string,
 *  cancelarTexto?: string
 * }} opciones
 * @returns {Promise<boolean>}
 */
export function confirmar(opciones = {}) {
  const {
    titulo = '¿Seguro?',
    texto = 'Esta acción no se puede deshacer.',
    icono = 'question',
    confirmarTexto = 'Sí, continuar',
    cancelarTexto = 'Cancelar'
  } = opciones

  const swal = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success me-3',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  return swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    showCancelButton: true,
    confirmButtonText: confirmarTexto,
    cancelButtonText: cancelarTexto
  }).then(res => !!res.isConfirmed)
}

/**
 * Azúcar sintáctica para confirmar eliminación
 * @param {string} nombre nombre a mostrar (ej: título del post)
 * @returns {Promise<boolean>}
 */
export function confirmarEliminacion(nombre = 'registro') {
  return confirmar({
    titulo: `¿Seguro de eliminar “${nombre}”?`,
    texto: 'Se perderá la información del elemento.',
    icono: 'question',
    confirmarTexto: 'Sí, eliminar',
    cancelarTexto: 'Cancelar'
  })
}
