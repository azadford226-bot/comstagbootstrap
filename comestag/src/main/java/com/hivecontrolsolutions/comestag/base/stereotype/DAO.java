package com.hivecontrolsolutions.comestag.base.stereotype;

import org.springframework.core.annotation.AliasFor;
import org.springframework.stereotype.Component;

import java.lang.annotation.*;

/**
 * Indicates that the annotated class is a Data Access Object (DAO) component.
 * <p>
 * This annotation functions as a specialization of {@code @Component}, allowing
 * the annotated class to be detected and registered automatically in the Spring
 * context during component scanning. It provides semantic clarity by marking
 * classes that encapsulate the logic for accessing and manipulating data,
 * typically from a database or other persistent storage.
 * <p>
 * This annotation can be used at the type level and supports an optional {@code value}
 * attribute to specify a custom component name.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface DAO {

    @SuppressWarnings("unused")
    @AliasFor(annotation = Component.class)
    String value() default "";
}
