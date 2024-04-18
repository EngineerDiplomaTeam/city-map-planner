using System.Collections;

namespace WebApi.Weather;

public class HourlyOptions : IEnumerable<HourlyOptionsParameter>, ICollection<HourlyOptionsParameter> {
    
        public static HourlyOptions All { get { return new HourlyOptions((HourlyOptionsParameter[])Enum.GetValues(typeof(HourlyOptionsParameter))); } }

        /// <summary>
        /// A copy of the current applied parameter. This is a COPY. Editing anything inside this copy won't be applied 
        /// </summary>
        public List<HourlyOptionsParameter> Parameter { get { return new List<HourlyOptionsParameter>(_parameter); } }

        public int Count => _parameter.Count;

        public bool IsReadOnly => false;

        private readonly List<HourlyOptionsParameter> _parameter;

        public HourlyOptions(HourlyOptionsParameter parameter)
        {
            _parameter = new List<HourlyOptionsParameter>();
            Add(parameter);
        }

        public HourlyOptions(HourlyOptionsParameter[] parameter)
        {
            _parameter = new List<HourlyOptionsParameter>();
            Add(parameter);
        }

        public HourlyOptions()
        {
            _parameter = new List<HourlyOptionsParameter>();
        }

        public HourlyOptionsParameter this[int index]
        {
            get { return _parameter[index]; }
            set
            {
                _parameter[index] = value;
            }
        }

        public void Add(HourlyOptionsParameter param)
        {
            // Check that the parameter isn't already added
            if (this._parameter.Contains(param)) return;

            _parameter.Add(param);
        }

        public void Add(HourlyOptionsParameter[] param)
        {
            foreach (HourlyOptionsParameter paramToAdd in param)
            {
                Add(paramToAdd);
            }
        }

        public IEnumerator<HourlyOptionsParameter> GetEnumerator()
        {
            return _parameter.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }

        public void Clear()
        {
            _parameter.Clear();
        }

        public bool Contains(HourlyOptionsParameter item)
        {
            return _parameter.Contains(item);
        }

        public void CopyTo(HourlyOptionsParameter[] array, int arrayIndex)
        {
            _parameter.CopyTo(array, arrayIndex);
        }

        public bool Remove(HourlyOptionsParameter item)
        {
            return _parameter.Remove(item);
        }
        
    }

    // This is converted to string so it has to be the exact same name like in 
    // https://open-meteo.com/en/docs #Hourly Parameter Definition
    public enum HourlyOptionsParameter
    {

        weathercode,

    }
