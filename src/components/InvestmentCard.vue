<script setup>
defineProps({
  investment: {
    type: Object,
    required: true
  },
  apartmentsCount: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <article class="investment-card">
    <div class="investment-card__number">
      {{ String(investment.id).slice(0, 2).toUpperCase() }}
    </div>

    <div class="investment-card__content">
      <p class="investment-card__location">
        {{ investment.city }} · {{ investment.district }}
      </p>

      <h2>{{ investment.name }}</h2>

      <p class="investment-card__address">
        {{ investment.address }}
      </p>

      <div class="investment-card__apartments">
        <strong>{{ apartmentsCount }}</strong>

        <span>
          {{ apartmentsCount === 1 ? 'mieszkanie' : 'mieszkań' }}
        </span>
      </div>

      <div class="investment-card__footer">
        <span> Planowane zakończenie </span>

        <strong>
          {{
            new Intl.DateTimeFormat('pl-PL', {
              month: 'long',
              year: 'numeric'
            }).format(new Date(investment.completionDate))
          }}
        </strong>
      </div>
    </div>
  </article>
</template>

<style scoped>
.investment-card {
  display: grid;
  min-height: 360px;
  grid-template-rows: 1fr auto;
  color: #ffffff;
  background-color: var(--color-primary);
}

.investment-card__number {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.08);
  font-family: var(--font-heading);
  font-size: clamp(90px, 12vw, 150px);
  line-height: 1;
}

.investment-card__content {
  padding: 30px;
}

.investment-card__location {
  margin-bottom: 12px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.investment-card h2 {
  margin-bottom: 10px;
  color: #ffffff;
  font-size: clamp(28px, 3vw, 38px);
}

.investment-card__address {
  margin-bottom: 28px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
}

.investment-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 18px;
  gap: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.investment-card__footer span {
  max-width: 110px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 9px;
  line-height: 1.4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.investment-card__footer strong {
  color: #ffffff;
  font-family: var(--font-heading);
  font-size: 19px;
  font-weight: 400;
}

.investment-card__apartments {
  display: flex;
  align-items: baseline;
  margin-bottom: 28px;
  gap: 8px;
}

.investment-card__apartments strong {
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-size: 38px;
  font-weight: 400;
  line-height: 1;
}

.investment-card__apartments span {
  color: rgba(255, 255, 255, 0.65);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 479px) {
  .investment-card {
    min-height: 320px;
  }

  .investment-card__content {
    padding: 24px 20px;
  }
}
</style>
