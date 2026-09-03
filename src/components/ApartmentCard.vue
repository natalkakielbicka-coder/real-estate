<script setup>
import { computed } from 'vue'

const props = defineProps({
  apartment: {
    type: Object,
    required: true
  }
})

const statusLabels = {
  available: 'Dostępne',
  reserved: 'Rezerwacja',
  sold: 'Sprzedane'
}

const outdoorSpaceLabels = {
  balcony: 'Balkon',
  terrace: 'Taras',
  garden: 'Ogródek',
  loggia: 'Loggia'
}

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
  <article class="apartment-card">
    <div class="apartment-card__visual">
      <div
        class="apartment-card__status"
        :class="`apartment-card__status--${apartment.status}`"
      >
        {{ statusLabels[apartment.status] }}
      </div>

      <button
        class="apartment-card__favorite"
        type="button"
        :aria-label="`Dodaj mieszkanie ${apartment.number} do ulubionych`"
      >
        ♡
      </button>

      <div class="apartment-card__plan">
        <span>{{ apartment.building }}</span>
        <strong>{{ apartment.number }}</strong>
        <small>{{ floorLabel }}</small>
      </div>

      <div v-if="apartment.featured" class="apartment-card__featured">
        Polecane
      </div>
    </div>

    <div class="apartment-card__content">
      <div class="apartment-card__location">
        <span>{{ apartment.investment }}</span>
        <small>{{ apartment.city }}, {{ apartment.district }}</small>
      </div>

      <h2>Mieszkanie {{ apartment.number }}</h2>

      <div class="apartment-card__parameters">
        <div>
          <strong>{{ apartment.rooms }}</strong>
          <span>pokoje</span>
        </div>

        <div>
          <strong>{{ apartment.area }} m²</strong>
          <span>powierzchnia</span>
        </div>

        <div>
          <strong>{{ floorLabel }}</strong>
          <span>kondygnacja</span>
        </div>
      </div>

      <div class="apartment-card__outdoor">
        <span>
          {{ outdoorSpaceLabels[apartment.outdoorSpace.type] }}
        </span>

        <strong>{{ apartment.outdoorSpace.area }} m²</strong>
      </div>

      <div class="apartment-card__footer">
        <div class="apartment-card__price">
          <span>cena mieszkania</span>
          <strong>{{ formattedPrice }} zł</strong>
          <small>{{ pricePerMeter }} zł/m²</small>
        </div>

        <button
          class="apartment-card__details"
          type="button"
          :disabled="apartment.status === 'sold'"
        >
          <span>
            {{ apartment.status === 'sold' ? 'Niedostępne' : 'Zobacz lokal' }}
          </span>

          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.apartment-card {
  overflow: hidden;
  background-color: var(--color-surface);
  box-shadow: 0 14px 45px rgba(23, 63, 53, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.apartment-card:hover {
  box-shadow: 0 22px 55px rgba(23, 63, 53, 0.14);
  transform: translateY(-6px);
}

.apartment-card__visual {
  position: relative;
  display: grid;
  min-height: 250px;
  place-items: center;
  overflow: hidden;
  background:
    linear-gradient(rgba(23, 63, 53, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23, 63, 53, 0.05) 1px, transparent 1px),
    linear-gradient(135deg, #f2eee5, #e5ddcf);
  background-size: 24px 24px, 24px 24px, cover;
}

.apartment-card__visual::before {
  position: absolute;
  width: 190px;
  height: 190px;
  content: "";
  border: 1px solid rgba(23, 63, 53, 0.12);
  border-radius: 50%;
}

.apartment-card__status {
  position: absolute;
  z-index: 2;
  top: 18px;
  left: 18px;
  padding: 7px 12px;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.apartment-card__status--available {
  background-color: var(--color-primary);
}

.apartment-card__status--reserved {
  background-color: #c28b3f;
}

.apartment-card__status--sold {
  background-color: #8b918e;
}

.apartment-card__favorite {
  position: absolute;
  z-index: 2;
  top: 15px;
  right: 16px;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: var(--color-primary);
  background-color: rgba(255, 255, 255, 0.9);
  border: 0;
  border-radius: 50%;
  font-size: 25px;
  line-height: 1;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.apartment-card__favorite:hover {
  color: #a94d4d;
  transform: scale(1.08);
}

.apartment-card__plan {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.apartment-card__plan span {
  margin-bottom: 5px;
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.apartment-card__plan strong {
  color: varlk;
  font-family: var(--font-heading);
  font-size: 58px;
  font-weight: 400;
  line-height: 1;
}

.apartment-card__plan small {
  margin-top: 10px;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 600;
}

.apartment-card__featured {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 8px 14px;
  color: var(--être-color-primary);
  background-color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.apartment-card__content {
  padding: 26px;
}

.apartment-card__location {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 12px;
}

.apartment-card__location span {
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.apartment-card__location small {
  color: var(--color-text-muted);
  font-size: 11px;
  text-align: right;
}

.apartment-card h2 {
  margin-bottom: 22px;
  font-size: 29px;
}

.apartment-card__parameters {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 18px;
  padding-block: 17px;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.apartment-card__parameters div {
  padding-inline: 12px;
  border-right: 1px solid var(--color-border);
}

.apartment-card__parameters div:first-child {
  padding-left: 0;
}

.apartment-card__parameters div:last-child {
  padding-right: 0;
  border-right: 0;
}

.apartment-card__parameters strong,
.apartment-card__parameters span {
  display: block;
}

.apartment-card__parameters strong {
  color: var(--color-primary);
  font-size: 13px;
}

.apartment-card__parameters span {
  margin-top: 3px;
  color: var(--color-text-muted);
  font-size: 9px;
  text-transform: uppercase;
}

.apartment-card__outdoor {
  display: flex;
  justify-content: space-between;
  margin-bottom: 22px;
  color: var(--color-text-muted);
  font-size: 12px;
}

.apartment-card__outdoor strong {
  color: var(--color-primary);
}

.apartment-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.apartment-card__price span,
.apartment-card__price small {
  display: block;
  color: var(--color-text-muted);
  font-size: 10px;
}

.apartment-card__price strong {
  display: block;
  margin-block: 2px 1px;
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 400;
}

.apartment-card__details {
  display: flex;
  align-items: center;
  min-height: 45px;
  padding-inline: 17px;
  gap: 12px;
  color: #ffffff;
  background-color: var(--color-primary);
  border: 0;
  font-size: 11px;
  font-weight: 700;
}

.apartment-card__details:hover:not(:disabled) {
  background-color: var(--color-primary-light);
}

.apartment-card__details:disabled {
  cursor: not-allowed;
  background-color: #a5aaa8;
}

@media (max-width: 479px) {
  .apartment-card__content {
    padding: 22px 18px;
  }

  .apartment-card__parameters div {
    padding-inline: 8px;
  }

  .apartment-card__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .apartment-card__details {
    justify-content: center;
  }
}
</style>