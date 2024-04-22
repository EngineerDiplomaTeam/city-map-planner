using System.Collections;

namespace WebApi.Weather;

/// <summary>
///     Weather models Variables (https://open-meteo.com/en/docs)
/// </summary>
public class WeatherModelOptions : IEnumerable
{
    private readonly List<WeatherModelOptionsParameter> _parameter;

    public WeatherModelOptions(WeatherModelOptionsParameter parameter)
    {
        _parameter = new List<WeatherModelOptionsParameter>();
        Add(parameter);
    }

    public WeatherModelOptions(WeatherModelOptionsParameter[] parameter)
    {
        _parameter = new List<WeatherModelOptionsParameter>();
        Add(parameter);
    }

    public WeatherModelOptions()
    {
        _parameter = new List<WeatherModelOptionsParameter>();
    }

    /// <summary>
    ///     Applying every parameter. Using WeatherModelOptions.All will consume around 50mb RAM when performing API requests.
    /// </summary>
    public static WeatherModelOptions All =>
        new((WeatherModelOptionsParameter[])Enum.GetValues(typeof(WeatherModelOptionsParameter)));

    /// <summary>
    ///     A copy of the current applied parameter. This is a COPY. Editing anything inside this copy won't be applied
    /// </summary>
    public List<WeatherModelOptionsParameter> Parameter => new(_parameter);

    public int Count => _parameter.Count;

    public bool IsReadOnly => false;

    public WeatherModelOptionsParameter this[int index]
    {
        get => _parameter[index];
        set => _parameter[index] = value;
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }

    public void Add(WeatherModelOptionsParameter param)
    {
        // Check that the parameter isn't already added
        if (_parameter.Contains(param)) return;

        _parameter.Add(param);
    }

    public void Add(WeatherModelOptionsParameter[] parameters)
    {
        foreach (var paramToAdd in parameters) Add(paramToAdd);
    }

    public IEnumerator<WeatherModelOptionsParameter> GetEnumerator()
    {
        return _parameter.GetEnumerator();
    }

    public void Clear()
    {
        _parameter.Clear();
    }

    public bool Contains(WeatherModelOptionsParameter item)
    {
        return _parameter.Contains(item);
    }

    public void CopyTo(WeatherModelOptionsParameter[] array, int arrayIndex)
    {
        _parameter.CopyTo(array, arrayIndex);
    }

    public bool Remove(WeatherModelOptionsParameter item)
    {
        return _parameter.Remove(item);
    }
}