namespace WebApi.Weather
{
    /// <summary>
    /// Returned by Geocoding Api.
    /// </summary>
    public class LocationData
    {
        /// <summary>
        /// Unique identifier for this exact location
        /// </summary>
        public int Id { get; set; }

        public float Latitude { get; set; }

        /// <summary>
        /// Geographical WGS84 coordinates of this location
        /// </summary>
        public float Longitude { get; set; }

        /// <summary>
        /// Timezone
        /// </summary>
        public string? Timezone { get; set; }

    }
}
