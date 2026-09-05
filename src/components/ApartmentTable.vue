<script setup>
import { apartmentStatusLabels } from '../constants/apartmentStatuses'

defineProps({
  apartments: {
    type: Array,
    required: true
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('pl-PL').format(price)
}

const getPricePerMeter = (apartment) => {
  const price = apartment.price / apartment.area

  return new Intl.NumberFormat('pl-PL', {
    maximumFractionDigits: 0
  }).format(price)
}

const getFloorLabel = (floor) => {
  return floor === 0 ? 'Parter' : `${floor}.`
}
</script>

<template>
  <div class="apartment-table-wrapper">
    <table class="apartment-table">
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
            <strong class="apartment-table__number">
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

          <td>{{ getPricePerMeter(apartment) }} zł</td>

          <td>
            <strong class="apartment-table__price">
              {{ formatPrice(apartment.price) }} zł
            </strong>
          </td>

          <td>
            <span
              class="apartment-table__status"
              :class="`apartment-table__status--${apartment.status}`"
            >
              {{ apartmentStatusLabels[apartment.status] }}
            </span>
          </td>

          <td>
            <RouterLink
              class="apartment-table__link"
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
.apartment-table-wrapper {
  overflow-x: auto;
  background-color: var(--color-surface);
  box-shadow: 0 14px 45px rgba(23, 63, 53, 0.08);
}

.apartment-table {
  width: 100%;
  min-width: 950px;
  border-collapse: collapse;
}

.apartment-table th {
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

.apartment-table td {
  padding: 18px 14px;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  font-size: 11px;
  white-space: nowrap;
}

.apartment-table tbody tr {
  transition: background-color 0.2s ease;
}

.apartment-table tbody tr:hover {
  background-color: rgba(23, 63, 53, 0.035);
}

.apartment-table tbody tr:last-child td {
  border-bottom: 0;
}

.apartment-table td strong,
.apartment-table td small {
  display: block;
}

.apartment-table td small {
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: 9px;
}

.apartment-table__number {
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 400;
}

.apartment-table__price {
  color: var(--color-primary);
  font-size: 12px;
}

.apartment-table__status {
  display: inline-flex;
  padding: 6px 9px;
  color: #ffffff;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.apartment-table__status--available {
  background-color: #3d806d;
}

.apartment-table__status--reserved {
  background-color: #c28b3f;
}

.apartment-table__status--sold {
  background-color: #929896;
}

.apartment-table__link {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  color: #ffffff;
  background-color: var(--color-primary);
  font-size: 17px;
}

.apartment-table__link:hover {
  background-color: var(--color-primary-light);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 767px) {
  .apartment-table {
    min-width: 850px;
  }

  .apartment-table th,
  .apartment-table td {
    padding-inline: 11px;
  }
}
</style>
