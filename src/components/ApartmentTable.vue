<script setup>
import { apartmentStatusLabels } from '../constants/apartmentStatuses'
import {
  getFloorLabel,
  formatPrice,
  formatPricePerMeter
} from '../utils/apartmentFormatters'

defineProps({
  apartments: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div
    class="overflow-x-auto bg-panel shadow-[0_14px_45px_rgba(23,63,53,0.08)]"
  >
    <table class="w-full min-w-[950px] border-collapse">
      <thead>
        <tr>
          <th>Lokal</th>
          <th>Inwestycja</th>
          <th>Pokoje</th>
          <th>Metraż</th>
          <th>Piętro</th>
          <th>Cena za m²</th>
          <th>Cena</th>
          <th>Status</th>

          <th>
            <span class="sr-only">Szczegóły</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="apartment in apartments"
          :key="apartment.id"
        >
          <td>
            <strong class="block font-display text-xl font-normal text-brand">
              {{ apartment.number }}
            </strong>

            <small>Budynek {{ apartment.building }}</small>
          </td>

          <td>
            <strong>{{ apartment.investment }}</strong>
            <small>{{ apartment.city }}</small>
          </td>

          <td>{{ apartment.rooms }}</td>

          <td>{{ apartment.area }} m²</td>

          <td>{{ getFloorLabel(apartment.floor) }}</td>

          <td>{{ formatPricePerMeter(apartment.price, apartment.area) }} zł</td>

          <td>
            <strong class="block text-xs text-brand">
              {{ formatPrice(apartment.price) }} zł
            </strong>
          </td>

          <td>
            <span
              class="inline-flex px-[9px] py-1.5 text-[8px] font-bold tracking-[0.05em] text-white uppercase"
              :class="{
                'bg-[#3d806d]': apartment.status === 'available',
                'bg-[#c28b3f]': apartment.status === 'reserved',
                'bg-[#929896]': apartment.status === 'sold'
              }"
            >
              {{ apartmentStatusLabels[apartment.status] }}
            </span>
          </td>

          <td>
            <RouterLink
              class="grid size-9 place-items-center text-brand transition-colors bg-brand text-white hover:text-gold"
              :to="`/mieszkania/${apartment.slug}`"
              :aria-label="`Zobacz mieszkanie ${apartment.number}`"
            >
              →
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th {
  padding: 17px 14px;
  color: var(--color-text-muted);
  background-color: var(--color-background);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

td {
  padding: 18px 14px;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  font-size: 11px;
  white-space: nowrap;
}

tbody tr {
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background-color: rgba(23, 63, 53, 0.035);
}

tbody tr:last-child td {
  border-bottom: 0;
}

td strong,
td small {
  display: block;
}

td small {
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: 9px;
}
</style>
