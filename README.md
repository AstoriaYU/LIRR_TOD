## TOD Opportunities for Long Island Rail Stations

- This application is based on the proposed high-speed rail lines and stations 
in the Rebooting New England studio report, using weighted multi-criteria 
evaluation method to identify the station with the most TOD opportunity. 
The aplication is designed as a web-based TOD opportunity rating system which 
aims to provide a friendly interface to a variety of public and private users, 
such as developers, decision-makers, researchers, and business owners. 

## The data

### Study Area

- Along the proposed high-speed rail line between New York and Boston, only 
Long Island doesn’t have Amtrak or regional rail access for long distance trips. 
Thus, this project proposed to study on the 122 commuter rail stations in Long 
Island regions. 

### Data

- The spatial data includes 122 existing Long Island rail stations, 8 Long Island 
rail routes, 0.5-miles buffers of corresponding rail stations. All these spatial
data are in geojson format.

- The attribute data includes 11 quantitative indicators for calculating TOD scores,
they are derived from DVRPC's TOD rating system:
1. Transit Connectivity Index (TCI)
2. Number of transit-accessible jobs via a 30-minute transit ride
3. Ratio of transit to auto travel time
4. Total number of residents and employees
5. Ratio of households with no car available
6. Ratio of non-car commute mode
7. Walk score
8. Number of high income customer households
9. Ratio of high intensity development area
10. Ratio of underutilized land
11. Median house value for all occupied housing units.

- The TOD opportunity score for each station is calculated from the 11 quantitative indicators through
weighted multi-criteria evaluation method.

- The census data at census block group level are also collected and joined to each 0.5-miles buffer. 
These socio-economic features are supplementary to the 11 criteria:
1. Population density (ppl/sqmi.)
2. Household density (hh/sqmi.)
3. Median age
4. Percent of Bachelor degree
5. Unemployment rate
6. Poverty rate.

## How to use it?

- The functions provided by this application include:
1. Change basemap layer, 10 basemap options
2. Change census data layer, 6 socio-economic attributes at census block group
3. Click a station or a buffer diaplay the stopname, route, street and TOD score info
4. Click a station and display a popup radar chart showing the value of criteria
5. Click a station buffer and display a popup census information within the buffer
6. Highlight a route segment when mouseover
7. Filter the stations according to the inputs of min and max TOD scores
8. Display a weights of criteria bar chart.
