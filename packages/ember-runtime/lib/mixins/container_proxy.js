/**
@module ember
*/
import {
  Mixin,
  run
} from 'ember-metal';

/**
  ContainerProxyMixin is used to provide public access to specific
  container functionality.

  @class ContainerProxyMixin
  @private
*/
let containerProxyMixin = {
  /**
   The container stores state.

   @private
   @property {Ember.Container} __container__
   */
  __container__: null,

  /**
   Returns an object that can be used to provide an owner to a
   manually created instance.

   Example:

   ```
   import { getOwner } from '@ember/application';

   let owner = getOwner(this);

   User.create(
     owner.ownerInjection(),
     { username: 'rwjblue' }
   )
   ```

   @public
   @method ownerInjection
   @since 2.3.0
   @return {Object}
  */
  ownerInjection() {
    return this.__container__.ownerInjection();
  },

  /**
   Given a fullName return a corresponding instance.

   The default behavior is for lookup to return a singleton instance.
   The singleton is scoped to the container, allowing multiple containers
   to all have their own locally scoped singletons.

   ```javascript
   let registry = new Registry();
   let container = registry.container();

   registry.register('api:twitter', Twitter);

   let twitter = container.lookup('api:twitter');

   twitter instanceof Twitter; // => true

   // by default the container will return singletons
   let twitter2 = container.lookup('api:twitter');
   twitter2 instanceof Twitter; // => true

   twitter === twitter2; //=> true
   ```

   If singletons are not wanted an optional flag can be provided at lookup.

   ```javascript
   let registry = new Registry();
   let container = registry.container();

   registry.register('api:twitter', Twitter);

   let twitter = container.lookup('api:twitter', { singleton: false });
   let twitter2 = container.lookup('api:twitter', { singleton: false });

   twitter === twitter2; //=> false
   ```

   @public
   @method lookup
   @param {String} fullName
   @param {Object} options
   @return {any}
   */
  lookup(fullName, options) {
    return this.__container__.lookup(fullName, options);
  },

  /**
   @private
   */
  willDestroy() {
    this._super(...arguments);

    if (this.__container__) {
      run(this.__container__, 'destroy');
    }
  },

/**
 Given a fullName return a factory manager.

  This method returns a manager which can be used for introspection of the
  factory's class or for the creation of factory instances with initial
  properties. The manager is an object with the following properties:

  * `class` - The registered or resolved class.
  * `create` - A function that will create an instance of the class with
    any dependencies injected.

  For example:

  ```javascript
  import { getOwner } from '@ember/application';

  let owner = getOwner(otherInstance);
  // the owner is commonly the `applicationInstance`, and can be accessed via
  // an instance initializer.

  let factory = owner.factoryFor('service:bespoke');

  factory.class;
  // The registered or resolved class. For example when used with an Ember-CLI
  // app, this would be the default export from `app/services/bespoke.js`.

  let instance = factory.create({
    someProperty: 'an initial property value'
  });
  // Create an instance with any injections and the passed options as
  // initial properties.
  ```

  @public
  @method factoryFor
  @param {String} fullName
  @param {Object} options
  @return {FactoryManager}
  */
  factoryFor(fullName, options = {}) {
    return this.__container__.factoryFor(fullName, options);
  }
};

export default Mixin.create(containerProxyMixin);
