<template>
  <v-card elevation="0">
    <div class="d-flex justify-space-between">
      <div
        class="d-flex"
        :class="{ 'w-100': !viewOnlyMode }"
      >
        <div
          class="font-weight-bold mr-5"
          :class="{ 'prod-fee-label': !viewOnlyMode }"
        >
          Product Fee:
        </div>
        <div v-if="viewOnlyMode">
          <div>
            Statutory Fee:
            <span
              class="font-weight-bold"
              data-test="apply-filing"
            >{{ applyFilingText }}</span>
          </div>
          <div>
            Service Fee:
            <span
              class="font-weight-bold"
              data-test="prod-filing"
            >{{ getProductFee }}</span>
          </div>
        </div>
        <div
          v-else
          class="d-flex w-100"
        >
          <ProductFeeSelector
            :canSelect="true"
            :orgProductFeeCodes="getOrgProductFeeCodesForProduct(orgProduct.product)"
            :productCode="orgProduct.product"
            :selectedApplyFilingFees="existingFeeCodes"
            @update:updatedProductFee="updatedProductFee"
          />
        </div>
      </div>
      <!-- v-can:CHANGE_ORG_NAME.disable -->
      <div v-if="viewOnlyMode">
        <span
          class="primary--text cursor-pointer"
          data-test="btn-edit"
          @click="updateViewOnlyMode(false)"
        >
          <v-icon
            color="primary"
            size="20"
          > mdi-pencil</v-icon>
          Change
        </span>
      </div>
    </div>

    <v-card-actions
      v-if="!viewOnlyMode"
      class="pt-1 pr-0"
    >
      <v-spacer />
      <v-btn
        outlined
        large
        depressed
        class="ml-2 px-9"
        color="primary"
        aria-label="Cancel product fee"
        data-test="reset-button"
        @click="updateViewOnlyMode(true)"
      >
        Cancel
      </v-btn>
      <v-btn
        large
        class="save-btn px-9"
        color="primary"
        :loading="isProductActionLoading"
        aria-label="Save product fee"
        @click="saveProductFee()"
      >
        <span class="save-btn__label">Save</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { AccountFee, OrgProductFeeCode } from '@/models/Organization'
import { PropType, computed, defineComponent, ref, watch } from '@vue/composition-api'
import ProductFeeSelector from '@/components/auth/common/ProductFeeSelector.vue'

export default defineComponent({
  name: 'ProductFeeViewEdit',
  components: {
    ProductFeeSelector
  },
  props: {
    orgProduct: {
      type: Object as PropType<AccountFee>,
      default: undefined
    },
    orgProductFeeCodes: {
      type: Array as PropType<OrgProductFeeCode[]>,
      default: undefined
    },
    isProductActionLoading: {
      type: Boolean
    },
    isProductActionCompleted: {
      type: Boolean
    }
  },
  emits: ['save:saveProductFee'],
  setup (props, { emit }) {
    const viewOnlyMode = ref(true)
    const selectedFee = ref<any>({})

    const updateViewOnlyMode = (mode = true) : void => {
      viewOnlyMode.value = mode
      if (mode === false) {
        // reset on cancel
        selectedFee.value = {}
      }
    }

    watch(() => props.isProductActionCompleted, (val, oldVal) => {
      if (val && val !== oldVal) {
        updateViewOnlyMode(true)
      }
    })

    const applyFilingText = computed<string>(() => {
      return props?.orgProduct?.applyFilingFees === true ? 'Yes' : 'No'
    })

    const productFee = () => {
      if (props.orgProductFeeCodes.length > 0) {
        const fees = props.orgProductFeeCodes.filter(
          (fee) => fee.code === props.orgProduct.serviceFeeCode
        )

        return fees && fees[0]
      }
      return {}
    }

    const getProductFee = computed<string>(() => {
      const fee: any = productFee()
      return fee.amount != null ? `$ ${fee.amount.toFixed(2)}` : ''
    })

    const updatedProductFee = (data) => {
      selectedFee.value = data
      return selectedFee.value
    }

    const saveProductFee = () => {
      emit('save:saveProductFee', selectedFee.value)
    }

    // Only allow $1.05 and $0 service fee code for ESRA aka Site Registry.
    const getOrgProductFeeCodesForProduct = (productCode: string) => {
      if (productCode === 'ESRA') {
        return props.orgProductFeeCodes?.filter((fee) => ['TRF03', 'TRF04'].includes(fee.code))
      }
      return props.orgProductFeeCodes?.filter((fee) => fee.code !== 'TRF03')
    }

    const existingFeeCodes = computed(() => {
      const existingApplyFilingFees = selectedFee.value?.applyFilingFees
        ? selectedFee.value?.applyFilingFees
        : props.orgProduct.applyFilingFees
      const fee: any = productFee()
      const selectedFeeCode = fee && fee.code
      const existingserviceFeeCode = selectedFee.value?.serviceFeeCode
        ? selectedFee.value?.serviceFeeCode
        : selectedFeeCode
      return { existingApplyFilingFees, existingserviceFeeCode }
    })

    return {
      viewOnlyMode,
      selectedFee,
      updateViewOnlyMode,
      productFee,
      updatedProductFee,
      getOrgProductFeeCodesForProduct,
      existingFeeCodes,
      saveProductFee,
      getProductFee,
      applyFilingText
    }
  }
})
</script>
<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';
.w-100 {
  width: 100%;
}
.prod-fee-label {
  width: 13%;
}
::v-deep {
  .v-select__selections {
    padding-top: 32px !important;
  }
  .v-select__selection {
    color: $gray7 !important;
  }
  .v-input__slot {
    color: $gray7 !important;
  }
}
</style>
