package com.hivecontrolsolutions.comestag.base.stereotype;

import org.springframework.core.annotation.AliasFor;
import org.springframework.stereotype.Component;

import java.lang.annotation.*;

/**
 * Indicates that the annotated class is a Publisher component within the system.
 * <p>
 * This annotation acts as a specialization of {@code @Component}, enabling the annotated
 * class to be automatically detected and registered in the Spring application context
 * during component scanning. It provides semantic clarity by explicitly marking classes
 * that function as Publishers, typically responsible for publishing messages or events
 * to other components in the application architecture.
 * <p>
 * The annotation can be applied at the type level and supports an optional {@code value}
 * attribute to specify a custom component name.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Publisher {

    @SuppressWarnings("unused")
    @AliasFor(annotation = Component.class)
    String value() default "";

}
