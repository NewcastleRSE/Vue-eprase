<template>

  <div>
    <h5>{{ testPayload.description }}</h5>
    <div>
      <Form ref="configErrorForm" v-slot="{ meta: formMeta }" :validation-schema="validationSchema">

        <div class="form-check mb-2">
          <Field v-slot="{ field }" v-model="response.result" type="radio" name="config-err-radios"
            id="config-err-radio-yes" value="1">
            <input v-bind="field" type="radio" name="config-err-radios" value="1" class="form-check-input">
          </Field>
          <label class="form-check-label" for="config-err-radio-yes">Yes</label>
        </div>

        <div class="form-check mb-2">
          <Field v-slot="{ field }" v-model="response.result" type="radio" name="config-err-radios"
            id="config-err-radio-no" value="0">
            <input v-bind="field" type="radio" name="config-err-radios" value="0" class="form-check-input">
          </Field>
          <label class="form-check-label" for="config-err-radio-no">No</label>
        </div>

        <input ref="configErrorCode" type="hidden" id="config-err-code" :value="testPayload.configErrorCode">

        <div class="my-2">          
          <button type="reset" class="btn btn-primary me-3" @click="onResetClick">
            <i class="bi bi-x pe-1"></i>Clear
          </button>
          <button type="button" class="btn btn-primary" @click="onNextClick()" :disabled="!formMeta.valid">
            <i :class="isLast ? 'bi bi-check2-circle' : 'bi bi-arrow-right-circle'"></i>
              {{ isLast ? 'Done' : 'Next' }}
          </button>           
        </div>
      </Form>

    </div>
  </div>

</template>

<script>

import dayjs from 'dayjs'
import { mapState } from 'pinia'
import { patientStore } from '../stores/patients'
import { Form, Field, ErrorMessage } from 'vee-validate'

export default {
  name: "ConfigError",
  props: {
    testPayload: {},
    isLast: false
  },
  components: {
    Form,
    Field,
    ErrorMessage
  },
  computed: {
    ...mapState(patientStore, ['saveConfigError'])
  },
  data() {
    return {
      response: {
        result: ''
      },
      startTime: '',
      validationSchema: {
        'config-err-radios': (value) => {
          console.debug('Validating radio value', value)
          return ['1', '0'].includes(value) ? true : 'Please select one' 
        }
      }
    }
  },
  methods: {  
    onResetClick() {
      this.$refs.configErrorForm.resetForm()
    },        
    async onNextClick() {

      console.group('ConfigError:onNextClick()')

      this.$refs.configErrorForm.validate().then(async (valid) => {
        if (valid) {
          const time_taken = dayjs().diff(this.startTime, 'seconds')
          const test_id = this.$refs.configErrorCode.value
          const result = this.response.result
          const saveResponse = await patientStore().saveConfigError(test_id, result, time_taken)
          console.log('Save response', saveResponse)
          if (saveResponse.status < 400) {
            this.$emit('test-save-ok')
          } else {
            this.$emit('test-save-fail', saveResponse.message)
          }
        }        
      })
      
      console.groupEnd()
    }
  },
  mounted: function () {
    this.startTime = dayjs()
  }
}
</script>

<style scoped>
</style>
