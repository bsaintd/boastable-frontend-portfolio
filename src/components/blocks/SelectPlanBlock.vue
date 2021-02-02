<template>
<v-item-group v-model="selectedPlan">
  <v-container >
    <v-layout class="plans" wrap >
      <v-flex align-content-center xs12 sm6>
        <h2>Pro Plan</h2>
        <v-item >
          <v-card
            max-width="240px"
            slot-scope="{ active, toggle }"
            @click="toggle"
            :class="active ? 'glow' : ''"
            :selected="active">
            <div class="pricetag">
              <div class="triangle"/>
              <div class="circle"/>
                <h4 class="price--line-through">$49.99</h4>
                <h1>
                  <span class="dollar">$</span>
                  24.99
                  <span class="per-month">/mo</span>
                </h1>
            </div>
            <v-divider/>
            <v-card-text>
              <ul>
                <li>1000 SMS Surveys per month</li>
                <li>1000 Email surveys per month</li>
                <li>Customized questions</li>
                <li>Send surveys offline from your phone</li>
                <li>Links your Google My Business account to collect reviews</li>
                <li>Instant customer analytics and feedback</li>
              </ul>
            </v-card-text>
          </v-card>
        </v-item>
      </v-flex>
      <!-- <v-flex xs12 sm6 md4>
        <h2>Pro Plan</h2>
        <v-item>
          <v-card
            slot-scope="{ active, toggle }"
            :selected="active"
            :class="active ? 'glow-blue' : ''"
            @click="toggle">
            <div class="pricetag">
              <div class="triangle blue-variant"/>
              <div class="circle"/>
              <h1>
                <span class="dollar">$</span>
                74.99
                <span class="per-month">/mo</span>
                </h1>
            </div>
            <v-divider/>
            <p class="pl-3 pt-3">Everything in the Basic plan plus...</p>
            <ul>
              <li>10,000 SMS/email surveys per month</li>
              <li>Batch sending features</li>
              <li>Custom calls to action</li>
            </ul>
          </v-card>
        </v-item>
      </v-flex> -->
      <v-flex xs12 sm6>
        <h2>Enterprise Plan</h2>
        <v-item>
        <v-card
          max-width="240px"
          slot-scope="{ active, toggle }"
          :selected="active"
          :class="active ? 'glow-blue' : ''"
          @click="toggle">
          <div class="pricetag">
            <div class="triangle blue-variant"/>
            <div class="circle"/>
            <h2>
              CONTACT US <br/> TO GET A QUOTE!
            </h2>
          </div>
          <v-divider/>
          <v-card-text>
          <ul>
            <li>Includes everything in the Pro plan</li>
            <li>Ideal for businesses that require a specially tailored review solution.</li>
          </ul>
          </v-card-text>
        </v-card>
        </v-item>
      </v-flex>
    </v-layout>
  </v-container>
</v-item-group>
</template>
<script>
export default {
  name: 'SelectPlanBlock',
  computed: {
    selectedPlan: {
      get() {
        return this.plan;
      },
      set(value) {
        this.plan = value;
        let planName = 'pro';
        switch (value) {
          case 0:
            planName = 'pro';
            break;
          case 1:
            planName = 'enterprise';
            break;
          default:
            break;
        }
        this.$emit('plan', planName);
      },
    },
  },
  data() {
    return {
      plan: null,
    };
  },
};
</script>
<style lang="scss" scoped>
  $blue: #0f3c59;
  $orange: #ee6d58;
  .plans {
    h2{
      text-align: center;
      margin-bottom: .5em;
      margin-top: .5em;
    }
  }
  ul{
    list-style-image: url('/static/green-check-12px.png');
  }

  .triangle {
    position: absolute;
    width: 0;
    height: 0;
    border: solid 40px;
    border-color: $orange transparent transparent $orange;
    &.blue-variant{
      border-color: $blue transparent transparent $blue;
    }
  }
  .circle {
    height: 15px;
    width: 15px;
    top: 15px;
    left: 15px;
    border-radius: 10px;
    background-color:white;
    position: absolute;
    z-index: 10;
  }
  .pricetag {
    h1{
      font-size: 2.5em;
    }
    .dollar{
      vertical-align: text-top;
      font-size: .4em;
      position: relative;
      top: .4em;
      left: .4em;
    }
    .per-month{
      position: relative;
      left: -0.5em;
      font-size: .5em;
    }
    height: 100px;
    > h1, h2{
      text-align:center;
      position: relative;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .special {
      text-align:center;
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .price--line-through{
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: transparent;
      background-image: gradient(linear, 19.1% -7.9%, 81% 107.9%,
        color-stop(0, transparent),
        color-stop(.48, transparent),
        color-stop(.481, #000),
        color-stop(.519, #000),
        color-stop(.52, transparent),
        color-stop(1, transparent));
      background-image: repeating-linear-gradient(163deg,
        transparent 0%,
        transparent 48%, $orange,
        transparent 52%, transparent 100%);
    }
  }
  .glow{
    box-shadow: 0px 0px 5px 3px $orange;
  }
  .glow-blue{
    box-shadow: 0px 0px 5px 3px $blue;
  }
  .v-card{
    height: 325px;
    font-size: .9em;
    margin: 0 auto 0 auto;
  }
</style>
