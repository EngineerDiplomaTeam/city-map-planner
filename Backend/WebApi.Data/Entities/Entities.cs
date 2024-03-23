namespace WebApi.Data.Entities
{
    public class PointOfInterest
    {
        public int Id { get; set; }
        public Address Address { get; set; }
        public WeatherCondition WeatherCondition { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        //public string LinkWithHours { get; set; }
        //public string LinkWithDescription { get; set; }
        //public string LinkToTicket { get; set; }
        public bool ReservationRequired { get; set; }
        public int RecommendedTourDuration { get; set; }
        //public int RecommendHours { get; set; } Do we really need this property?
        public ICollection<AgeRestriction> AgeRestrictions { get; set; }
        public ICollection<ContactInfo> ContactInfos { get; set; }
        public ICollection<Passage> Passages { get; set; }
        public ICollection<TicketOffice> TicketOffices { get; set; }
        public ICollection<OpenRange> OpenRanges { get; set; }

        // List<TicketOffice> TicketOfficeIds
        // Powiązanie z kasami biletowymi po ID
    }


    public enum WeatherCondition
    {
        
    }

    public class AgeRestriction
    {
        public int Id { get; set; }
        public int AgeFrom { get; set; }
        public int AgeTo { get; set; }
    }

    public class TicketOffice
    {
        // open hours
        // ticket types
        // has online ticket office
        public ICollection<OpenRange> OpenRange { get; set; }
    }


    public class Address
    {
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string StreetNumber { get; set; }
        public string PostalCode { get; set; }
    }

    public class ContactInfo
    {
        public int Id { get; set; }
        public List<string> Phone { get; set; }
        public List<string> Emails { get; set; }
    }

    public class Passage
    {
        public int Id { get; set; }
        public Location Location { get; set; }
        public PassageType PassageType { get; set; }
    }

    [Flags]
    public enum PassageType
    {
        None = 0,
        Entrance = 1,
        Exit = 2,
        // 4 8 16 32 etc
    }

    public class Location
    {
        public int Id { get; set; }
        public long Longitude { get; set; }
        public long Latitude { get; set; }
    }

    public class OpenRange
    {
        public int Id { get; set; }
        public DateOnly DateFrom { get; set; }
        public DateOnly DateTo { get; set; }
        public int DayOfWeek { get; set; }
        public TimeSpan HourStart { get; set; }
        public TimeSpan HourClose { get; set; }
    }
}
