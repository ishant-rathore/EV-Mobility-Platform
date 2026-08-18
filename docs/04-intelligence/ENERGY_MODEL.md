# EV Energy Model

## MVP baseline

`energy_kWh = distance_km × consumption_kWh_per_km`

Apply a conservative reserve margin before recommending a charging stop.

## Optional adjustment factors
- Traffic
- Elevation
- Weather
- Auxiliary load
- Driving conditions

## Output
- Estimated energy required
- Expected arrival SOC
- Charging required: YES/NO
- Suggested charging target
- Safety/reserve margin
