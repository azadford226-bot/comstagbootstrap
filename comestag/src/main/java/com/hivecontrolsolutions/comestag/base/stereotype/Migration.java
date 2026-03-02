package com.hivecontrolsolutions.comestag.base.stereotype;

import org.springframework.core.annotation.AliasFor;
import org.springframework.stereotype.Component;

import java.lang.annotation.*;

/**
 * Indicates that the annotated class represents a Migration component in the system.
 * <p>
 * This annotation serves as a specialization of {@code @Component}, allowing the annotated
 * class to be detected and registered automatically in the Spring application context during
 * component scanning. It is designed to semantically categorize components that are responsible
 * for performing migration tasks, typically involving schema updates, data processing, or system
 * transformations.
 * <p>
 * The annotation can be applied at the type level and supports an optional {@code value} attribute
 * to specify a custom component name.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Migration {

    @SuppressWarnings("unused")
    @AliasFor(annotation = Component.class)
    String value() default "";

}
