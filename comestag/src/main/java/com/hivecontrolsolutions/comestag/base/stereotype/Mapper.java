package com.hivecontrolsolutions.comestag.base.stereotype;

import org.springframework.core.annotation.AliasFor;
import org.springframework.stereotype.Component;

import java.lang.annotation.*;

/**
 * Indicates that the annotated class is a Mapper component within the system.
 * <p>
 * This annotation is a specialization of {@code @Component}, allowing the annotated
 * class to be detected and registered automatically in the Spring application context
 * during component scanning. It provides semantic clarity by explicitly marking
 * classes that are responsible for mapping data between different layers or formats
 * in the application.
 * <p>
 * The annotation can be applied at the type level and supports an optional {@code value}
 * attribute to specify a custom component name.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Mapper {

    @SuppressWarnings("unused")
    @AliasFor(annotation = Component.class)
    String value() default "";

}
