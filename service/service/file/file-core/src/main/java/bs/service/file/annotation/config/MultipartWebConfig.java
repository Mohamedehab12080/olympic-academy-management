package bs.service.file.annotation.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class MultipartWebConfig implements WebMvcConfigurer {

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        // Add ResourceHttpMessageConverter first to handle InputStreamResource
        converters.add(new ResourceHttpMessageConverter());
        converters.add(new ByteArrayHttpMessageConverter());
        converters.add(new StringHttpMessageConverter());
        converters.add(new MappingJackson2HttpMessageConverter());
    }

    // Alternatively, extend the default converters instead of replacing them
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        // This will add to the default converters instead of replacing them
        converters.add(0, new ResourceHttpMessageConverter());
        converters.add(1, new ByteArrayHttpMessageConverter());
    }
}
