<script setup>
import { computed } from 'vue'
import { apartmentStatusLabels } from '../constants/apartmentStatuses'

const props = defineProps({
  apartment: {
    type: Object,
    required: true
  }
})

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('pl-PL').format(props.apartment.price)
})

const pricePerMeter = computed(() => {
  const price = props.apartment.price / props.apartment.area

  return new Intl.NumberFormat('pl-PL', {
    maximumFractionDigits: 0
  }).format(price)
})

const floorLabel = computed(() => {
  return props.apartment.floor === 0
    ? 'Parter'
    : `${props.apartment.floor}. piętro`
})
</script>

<template>
  <article class="apartment-list-item">
    <div class="apartment-list-item__number">
      <span>Budynek {{ apartment.building }}</span>
      <strong>{{ apartment.number }}</strong>
      <small>{{ floorLabel }}</small>
    </div>

    <div class="apartment-list-item__content">
      <div class="apartment-list-item__heading">
        <div>
          <p>{{ apartment.investment }}</p>
          <h2>Mieszkanie {{ apartment.number }}</h2>
        </div>

        <span
          class="apartment-list-item__status"
          :class="`apartment-list-item__status--${apartment.status}`"
        >
          {{ apartmentStatusLabels[apartment.status] }}
        </span>
      </div>

      <p class="apartment-list-item__location">
        {{ apartment.city }}, {{ apartment.district }}
      </p>

      <div class="apartment-list-item__parameters">
        <span
          ><strong>{{ apartment.rooms }}</strong> pokoje</span
        >
        <span
          ><strong>{{ apartment.area }} m²</strong> powierzchni</span
        >
        <span
          ><strong>{{ floorLabel }}</strong> kondygnacja</span
        >
      </div>
    </div>

    <div class="apartment-list-item__footer">
      <div>
        <span>Cena mieszkania</span>
        <strong>{{ formattedPrice }} zł</strong>
        <small>{{ pricePerMeter }} zł/m²</small>
      </div>

      <RouterLink :to="`/mieszkania/${apartment.slug}`">
        Zobacz lokal
        <span aria-hidden="true">→</span>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.apartment-list-item {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr) 210px;
  min-height: 190px;
  background-color: var(--color-surface);
  box-shadow: 0 12px 35px rgba(23, 63, 53, 0.07);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.apartment-list-item:hover {
  box-shadow: 0 18px 45px rgba(23, 63, 53, 0.12);
  transform: translateY(-3px);
}

.apartment-list-item__number {
  display: flex;
  align-items: center;
  padding: 24px;
  flex-direction: column;
  justify-content: center;
  background:
    linear-gradient(rgba(23, 63, 53, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23, 63, 53, 0.05) 1px, transparent 1px), #f2eee5;
  background-size: 22px 22px;
}

.apartment-list-item__number span,
.apartment-list-item__number small {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

.apartment-list-item__number strong {
  margin-block: 5px;
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 45px;
  font-weight: 400;
}

.apartment-list-item__content {
  padding: 28px;
}

.apartment-list-item__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.apartment-list-item__heading p {
  margin-bottom: 5px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.apartment-list-item h2 {
  margin-bottom: 0;
  font-size: 28px;
}

.apartment-list-item__status {
  flex-shrink: 0;
  padding: 7px 10px;
  color: #ffffff;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.apartment-list-item__status--available {
  background-color: #3d806d;
}

.apartment-list-item__status--reserved {
  background-color: #c28b3f;
}

.apartment-list-item__status--sold {
  background-color: #929896;
}

.apartment-list-item__location {
  margin-block: 8px 22px;
  color: var(--color-text-muted);
  font-size: 11px;
}

.apartment-list-item__parameters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 25px;
  color: var(--color-text-muted);
  font-size: 10px;
}

.apartment-list-item__parameters strong {
  margin-right: 3px;
  color: var(--color-primary);
  font-size: 12px;
}

.apartment-list-item__footer {
  display: flex;
  align-items: flex-end;
  padding: 28px;
  flex-direction: column;
  justify-content: space-between;
  border-left: 1px solid var(--color-border);
  text-align: right;
}

.apartment-list-item__footer div > span,
.apartment-list-item__footer small {
  display: block;
  color: var(--color-text-muted);
  font-size: 9px;
}

.apartment-list-item__footer strong {
  display: block;
  margin-block: 4px;
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 23px;
  font-weight: 400;
}

.apartment-list-item__footer a {
  display: inline-flex;
  align-items: center;
  min-height: 43px;
  padding-inline: 16px;
  gap: 12px;
  color: #ffffff;
  background-color: var(--color-primary);
  font-size: 10px;
  font-weight: 700;
}

.apartment-list-item__footer a:hover {
  background-color: var(--color-primary-light);
}

@media (max-width: 991px) {
  .apartment-list-item {
    grid-template-columns: 140px minmax(0, 1fr);
  }

  .apartment-list-item__footer {
    grid-column: 1 / -1;
    align-items: center;
    flex-direction: row;
    border-top: 1px solid var(--color-border);
    border-left: 0;
    text-align: left;
  }
}

@media (max-width: 767px) {
  .apartment-list-item {
    grid-template-columns: 110px minmax(0, 1fr);
  }

  .apartment-list-item__content,
  .apartment-list-item__footer {
    padding: 22px;
  }

  .apartment-list-item__heading {
    flex-direction: column-reverse;
    gap: 10px;
  }
}

@media (max-width: 479px) {
  .apartment-list-item {
    grid-template-columns: 1fr;
  }

  .apartment-list-item__number {
    min-height: 150px;
  }

  .apartment-list-item__footer {
    align-items: stretch;
    flex-direction: column;
    gap: 20px;
  }

  .apartment-list-item__footer a {
    justify-content: center;
  }
}
</style>
