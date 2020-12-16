import { Fn } from './utils';
import { TypeSerializer } from './type.serializer';
import { TypeOptions } from './type.options';
import { TypeDeclaration } from './type.declaration';
import { TypeCtor } from './type.ctor';
import { PropertyMetadata } from './property.metadata';
import { PropertyOptions } from './property.options';

/**
 * Main class used to describe a certain type.
 * 
 * @type {TypeMetadata}
 */
export class TypeMetadata
{
    /**
     * Type name. 
     * 
     * Defined at runtime based on the constructor function.
     * 
     * @type {string}
     */
    public name: string;

    /**
     * Type constructor function.
     * 
     * @type {TypeCtor}
     */
    public typeCtor: TypeCtor;

    /**
     * Type declaration.
     * 
     * Metadata can be declared explicitly by developer of implicitly at runtime.
     * 
     * @type {TypeDeclaration}
     */
    public typeDeclaration: TypeDeclaration;

    /**
     * Serializer used to serialize and deserialize a type.
     * 
     * @type {TypeSerializer}
     */
    public typeSerializer: TypeSerializer;

    /**
     * Type alias. 
     * 
     * Can be used to resolve a type at runtime instead of type resolver function.
     * 
     * @type {string}
     */
    public alias?: string;

    /**
     * Default value for undefined values.
     * 
     * @type {any}
     */
    public defaultValue?: any;

    /**
     * Properties defined for a type.
     * 
     * @type {Map<string, PropertyMetadata>}
     */
    public readonly propertyMetadataMap: Map<string, PropertyMetadata> = new Map<string, PropertyMetadata>();

    /**
     * Constructor.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {TypeDeclaration} typeDeclaration Type declaration.
     * @param {TypeSerializer} typeSerializer Type serializer.
     */
    public constructor(typeCtor: TypeCtor, typeDeclaration: TypeDeclaration, typeSerializer: TypeSerializer)
    {
        this.name            = Fn.nameOf(typeCtor);
        this.typeCtor        = typeCtor;
        this.typeDeclaration = typeDeclaration;
        this.typeSerializer  = typeSerializer;
        
        return;
    }

    /**
     * Checks if type metadata was declared explicitly.
     * 
     * @returns {boolean} True when declared explicitly. False otherwise.
     */
    public get declaredExplicitly(): boolean
    {
        return this.typeDeclaration === TypeDeclaration.Explicit;
    }

    /**
     * Checks if type metadata was declared implicitly.
     * 
     * @returns {boolean} True when declared implicitly. False otherwise.
     */
    public get declaredImplicitly(): boolean
    {
        return this.typeDeclaration === TypeDeclaration.Implicit;
    }

    /**
     * Configures property metadata map.
     * 
     * @param {Map<string, PropertyOptions>} propertyOptionsMap Property options map.
     * 
     * @returns {void}
     */
    public configurePropertyMetadataMap(propertyOptionsMap: Map<string, PropertyOptions>): void
    {
        propertyOptionsMap.forEach((propertyOptions, propertyName) =>
        {
            const propertyMetadata = new PropertyMetadata(propertyName);

            this.propertyMetadataMap.set(propertyName, propertyMetadata.configure(propertyOptions));
        });

        return;
    }

    /**
     * Configures type metadata based on provided options.
     * 
     * @param {TypeOptions} typeOptions Type options.
     * 
     * @returns {TypeMetadata} Instance of type metadata.
     */
    public configure(typeOptions: TypeOptions): TypeMetadata
    {
        if (!Fn.isNil(typeOptions.propertyOptionsMap))
        {
            this.configurePropertyMetadataMap(typeOptions.propertyOptionsMap);
        }

        if (!Fn.isNil(typeOptions.typeSerializer)) 
        {
            this.typeSerializer = typeOptions.typeSerializer;
        }

        if (!Fn.isNil(typeOptions.alias)) 
        {
            this.alias = typeOptions.alias;
        }

        if (!Fn.isNil(typeOptions.defaultValue)) 
        {
            this.defaultValue = typeOptions.defaultValue;
        }
        
        return this;
    }
}
