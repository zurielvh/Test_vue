<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Consulta y Alta</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-teal"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab name="consulta" label="Consulta" icon="search" />
            <q-tab name="alta" label="Alta" icon="add_circle" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <!-- TAB Consulta -->
            <q-tab-panel name="consulta">
              <div class="q-pa-md">
                <h6>Consulta de registros</h6>

                <q-input
                  filled
                  v-model="searchId"
                  label="Buscar por ID Tarifa"
                  @keyup.enter="buscarRegistro"
                  clearable
                />
                <q-btn label="Buscar" color="primary" class="q-mt-sm" @click="buscarRegistro" />

                <div v-if="registroEncontrado" class="q-mt-md">
                  <q-card flat bordered class="q-pa-md">
                    <div><strong>ID Tarifa:</strong> {{ registroEncontrado.idTarifa }}</div>
                    <div><strong>Tarifa:</strong> {{ registroEncontrado.tarifa }}</div>
                    <div><strong>Concepto:</strong> {{ registroEncontrado.concepto }}</div>
                    <div><strong>Estatus:</strong> {{ registroEncontrado.estatus }}</div>
                    <div><strong>Tipo Producto:</strong> {{ registroEncontrado.tipoProducto }}</div>
                    <div>
                      <strong>Tipo Documento:</strong> {{ registroEncontrado.tipoDocumento }}
                    </div>
                    <div><strong>Día Inicio:</strong> {{ registroEncontrado.diaInicio }}</div>
                    <div><strong>Día Fin:</strong> {{ registroEncontrado.diaFin }}</div>
                    <div><strong>Importe:</strong> {{ registroEncontrado.importe }}</div>
                    <div>
                      <strong>Última Modificación:</strong>
                      {{ registroEncontrado.fh_ultima_modificacion }}
                    </div>
                    <div>
                      <strong>Aplicativos:</strong> {{ registroEncontrado.aplicativos.join(', ') }}
                    </div>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="alta">
              <q-form @submit.prevent="onSubmit">
                <div class="q-pa-md row q-gutter-md">
                  <div class="col-xs-12 col-sm-3">
                    <q-input v-model.number="form.idTarifa" label="ID Tarifa*" filled required />
                  </div>
                  <div class="col-xs-12 col-sm-3">
                    <q-input v-model="form.tarifa" label="Tarifa*" filled required />
                  </div>
                  <div class="col-xs-12 col-sm-3">
                    <q-input v-model="form.concepto" label="Concepto*" filled required />
                  </div>
                  <div class="col-xs-12 col-sm-3">
                    <q-input v-model="form.tipoProducto" label="Tipo Producto*" filled required />
                  </div>
                  <div class="col-xs-12 col-sm-3">
                    <q-input v-model="form.estatus" label="Estatus*" filled required />
                  </div>
                  <div class="col-xs-12 col-sm-3">
                    <q-input v-model="form.tipoDocumento" label="Tipo Documento*" filled required />
                  </div>

                  <div class="col-xs-12 col-sm-3">
                    <q-input
                      v-model="form.diaInicio"
                      label="Día Inicio*"
                      type="date"
                      filled
                      required
                    />
                  </div>
                  <div class="col-xs-12 col-sm-3">
                    <q-input v-model="form.diaFin" label="Día Fin*" type="date" filled required />
                  </div>
                  <div class="col-xs-12 col-sm-3">
                    <q-input
                      v-model.number="form.importe"
                      label="Importe*"
                      type="number"
                      filled
                      required
                    />
                  </div>
                  <div class="col-xs-12 col-sm-3">
                    <q-input
                      v-model="form.fh_ultima_modificacion"
                      label="Última Modificación*"
                      type="date"
                      filled
                      required
                    />
                  </div>

                  <div class="col-xs-12 col-sm-3">
                    <q-select
                      v-model="form.aplicativos"
                      :options="aplicativosOptions"
                      label="Aplicativos*"
                      multiple
                      use-chips
                      required
                    />
                  </div>
                  <div class="col-xs-12 col-sm-3">
                    <q-btn type="submit" label="Guardar" color="primary" />
                  </div>
                </div>
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()
const tab = ref('consulta')

const searchId = ref('')
const registroEncontrado = ref(null)
const localRows = ref([])
const aplicativosOptions = ['App1', 'App2', 'App3', 'App4']

const form = ref({
  idTarifa: '',
  tarifa: '',
  concepto: '',
  estatus: '',
  tipoProducto: '',
  tipoDocumento: '',
  diaInicio: '',
  diaFin: '',
  importe: '',
  fh_ultima_modificacion: '',
  aplicativos: [],
})

function onSubmit() {
  try {
    JSON.parse(form.value.estatus)
    JSON.parse(form.value.tipoDocumento)
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Estatus o Tipo Documento no son JSON válidos',
    })
    return
  }

  localRows.value.push({ ...form.value })

  $q.notify({
    type: 'positive',
    message: 'Registro guardado correctamente',
  })

  form.value = {
    idTarifa: '',
    tarifa: '',
    concepto: '',
    estatus: '',
    tipoProducto: '',
    tipoDocumento: '',
    diaInicio: '',
    diaFin: '',
    importe: '',
    fh_ultima_modificacion: '',
    aplicativos: [],
  }

  tab.value = 'consulta'
}
async function buscarRegistro() {
  const id = Number(searchId.value)
  registroEncontrado.value = null

  try {
    const response = await axios.post('/api/tarifas/consulta', { idTarifa: id })

    const tarifasEndpoint = response.data.response.tarifas || []

    if (tarifasEndpoint.length > 0) {
      registroEncontrado.value = tarifasEndpoint[0]
    } else {
      registroEncontrado.value = localRows.value.find((r) => r.idTarifa === id) || null
    }

    if (!registroEncontrado.value) {
      $q.notify({
        type: 'warning',
        message: `No se encontró el registro con ID Tarifa ${searchId.value}`,
      })
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error consultando el endpoint',
    })
  }
}
</script>
